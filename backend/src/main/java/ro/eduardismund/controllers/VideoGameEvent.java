package ro.eduardismund.controllers;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class VideoGameEvent {
  final private ActionType action;
  final private Object payload;
}
