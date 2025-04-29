package ro.eduardismund.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class AuthorizationErrorHandlers {

  @ExceptionHandler(LoginRequiredException.class)
  public ResponseEntity<Object> handleLoginRequiredException(LoginRequiredException ex) {
    return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(Map.of("error", "Login required"));
  }

  @ExceptionHandler(UnauthorizedUserException.class)
  public ResponseEntity<Object> handleUnauthorizedUserException(UnauthorizedUserException ex) {
    return ResponseEntity.status(403).contentType(MediaType.APPLICATION_JSON).body(Map.of("error", "Unauthorized user"));
  }
}
