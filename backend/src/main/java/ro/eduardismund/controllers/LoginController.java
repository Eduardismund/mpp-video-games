package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.eduardismund.domain.Token;
import ro.eduardismund.domain.TokenRepository;
import ro.eduardismund.domain.UserRepository;
import ro.eduardismund.dtos.LoginRequest;
import ro.eduardismund.dtos.LoginResponse;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class LoginController {
  private final UserRepository userRepository;
  private final TokenRepository tokenRepository;

  @PostMapping
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) throws InvalidUsernameOrPasswordException {
    final var user = userRepository.findByUsername(request.getUsername()).filter(u -> u.getPassword().equals(request.getPassword()));
    if(user.isEmpty()){
      throw new InvalidUsernameOrPasswordException();
    }
    final var token = new Token();
    token.setUser(user.get());
    token.setToken(UUID.randomUUID().toString());
    tokenRepository.save(token);
    return ResponseEntity.ok(new LoginResponse().setToken(token.getToken()).setRole(user.get().getRole().getValue()));
  }

  @ExceptionHandler(InvalidUsernameOrPasswordException.class)
  public ResponseEntity<Object> handleInvalidUsernameOrPasswordException(InvalidUsernameOrPasswordException ex) {
    return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(Map.of("error", "Invalid Username Or Password"));
  }
}
