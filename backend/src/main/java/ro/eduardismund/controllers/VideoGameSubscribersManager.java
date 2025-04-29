package ro.eduardismund.controllers;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class VideoGameSubscribersManager {

  private final Map<String, VideoGameSubscriber> subscribers = new ConcurrentHashMap<>();

  @Getter
  @Setter
  private boolean enabled = true;

  public VideoGameSubscribersManager() {
    final var scheduler = Executors.newSingleThreadScheduledExecutor();
    scheduler.scheduleAtFixedRate(() -> {
      if (enabled) {
        subscribers.values().forEach(sub -> sub.onAction(ActionType.PING, Map.of("datetime", Instant.now().toString())));
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
    for (VideoGameSubscriber subscriber : subscribers.values()) {
      subscriber.onAction(action, payload);
    }
  }
}
