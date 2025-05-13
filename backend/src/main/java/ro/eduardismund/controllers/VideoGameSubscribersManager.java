package ro.eduardismund.controllers;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Slf4j
public class VideoGameSubscribersManager {

  private final Map<String, VideoGameSubscriber> subscribers = new ConcurrentHashMap<>();

  @Getter
  @Setter
  private boolean enabled = true;

  public VideoGameSubscribersManager() {
    final var scheduler = Executors.newSingleThreadScheduledExecutor();
    scheduler.scheduleAtFixedRate(() -> {
      if (enabled) {
        subscribers.forEach((key, subscriber) -> {
          try {
            subscriber.onAction(ActionType.PING, Map.of("datetime", Instant.now().toString()));
          } catch (VideoGameSubscriberObsoleteException e) {
            log.warn(e.getMessage(), e);
            subscribers.remove(key);
          }
        });
      }
    }, 0, 1, TimeUnit.SECONDS);
  }


  public void addSubscriber(String key, VideoGameSubscriber subscriber) {
    this.subscribers.put(key, subscriber);
  }

  public void removeSubscriber(String key) {
    this.subscribers.remove(key);
  }

  public void notifySubscribers(ActionType action, Object payload) {
    for (var subscriber : subscribers.entrySet()) {
      try {
        subscriber.getValue().onAction(action, payload);
      } catch (VideoGameSubscriberObsoleteException e) {
        log.warn(e.getMessage(), e);
        subscribers.remove(subscriber.getKey());
      }
    }
  }
}
