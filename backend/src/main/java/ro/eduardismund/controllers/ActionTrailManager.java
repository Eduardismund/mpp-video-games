package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import ro.eduardismund.domain.ActionTrailItem;
import ro.eduardismund.domain.ActionTrailRepository;
import ro.eduardismund.domain.ActionTrailType;
import ro.eduardismund.domain.User;

import java.time.Instant;

@RequiredArgsConstructor
public class ActionTrailManager {
  private final ActionTrailRepository actionTrailRepository;

  public void logAction(ActionTrailType actionTrailType, User user) {
    final var actionTrailItem = new ActionTrailItem();
    actionTrailItem.setAction(actionTrailType);
    actionTrailItem.setUser(user);
    actionTrailItem.setTimestamp(Instant.now());
    actionTrailRepository.save(actionTrailItem);
  }
}
