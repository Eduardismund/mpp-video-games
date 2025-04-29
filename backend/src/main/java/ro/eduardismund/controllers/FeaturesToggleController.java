package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.eduardismund.dtos.ChangeFeatureToggleRequest;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/feature-toggles")
public class FeaturesToggleController {
  private final VideoGameSubscribersManager videoGameSubscribersManager;

  @PostMapping
  public ResponseEntity<Void> toggle(@RequestBody ChangeFeatureToggleRequest request){
    videoGameSubscribersManager.setEnabled(request.getSubscriptions());
    return ResponseEntity.ok().build();
  }
}
