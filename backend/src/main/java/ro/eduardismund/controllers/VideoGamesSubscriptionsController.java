package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/video-games/subscriptions")
public class VideoGamesSubscriptionsController {
  private final VideoGameSubscribersManager videoGameSubscribersManager;

  @GetMapping
  public SseEmitter subscribe() {
    if(!videoGameSubscribersManager.isEnabled()){
      throw new IllegalStateException("Subscriptions are off");
    }
    final var emitter = new SseEmitter(60_000L);
    final var subscriberKey = UUID.randomUUID().toString();
    videoGameSubscribersManager.addSubscriber(subscriberKey, new SseEmitterSubscriber(emitter));


    emitter.onCompletion(() -> {
      videoGameSubscribersManager.removeSubscriber(subscriberKey);
      System.out.println("Subscription stopped for client " + subscriberKey);
    });

    emitter.onTimeout(() -> {
      videoGameSubscribersManager.removeSubscriber(subscriberKey);
      System.out.println("Subscription timed out for client" + subscriberKey);
      emitter.complete();
    });

    return emitter;
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<Object> handleIllegalStateException(IllegalStateException ex) {
    return ResponseEntity.internalServerError().contentType(MediaType.APPLICATION_JSON).body(Map.of("error", ex.getMessage()));
  }
}
