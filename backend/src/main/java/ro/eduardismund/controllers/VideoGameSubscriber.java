package ro.eduardismund.controllers;

@FunctionalInterface
public interface VideoGameSubscriber {
  void onAction(ActionType action, Object payload) throws VideoGameSubscriberObsoleteException;
}
