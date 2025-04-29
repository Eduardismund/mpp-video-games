package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.UUID;

@RequiredArgsConstructor
public class SseEmitterSubscriber implements VideoGameSubscriber {
  private final SseEmitter emitter;

  @Override
  public void onAction(ActionType action, Object payload) {
    try {
      SseEmitter.SseEventBuilder event = SseEmitter.event()
        .id(UUID.randomUUID().toString())
        .name(action.name().toLowerCase())
        .data(new VideoGameEvent(action, payload), MediaType.APPLICATION_JSON);
      emitter.send(event);
    } catch (IOException e) {
      emitter.completeWithError(e);
    }
  }
}
