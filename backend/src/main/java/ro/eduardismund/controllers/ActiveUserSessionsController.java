package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ro.eduardismund.domain.TokenRepository;
import ro.eduardismund.domain.TokenStatus;
import ro.eduardismund.dtos.GetActiveUserSessionsResponse;
import ro.eduardismund.dtos.TokensMapper;

@RestController
@RequestMapping("/api/active-user-sessions")
@RequiredArgsConstructor
public class ActiveUserSessionsController {
  private final AuthorizationManager authorizationManager;
  private final TokenRepository tokenRepository;
  private final TokensMapper tokensMapper;

  @GetMapping
  @Transactional(readOnly = true)
  public ResponseEntity<GetActiveUserSessionsResponse> getTokens(@RequestHeader(required = false, name = "Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {
    authorizationManager.requireAdmin(authorization);
    final var umStream = tokenRepository.streamByStatus(TokenStatus.ACTIVE).map(tokensMapper::toResponse).toList();
    return ResponseEntity.ok(new GetActiveUserSessionsResponse().setItems(umStream));
  }

  @Transactional
  @DeleteMapping("{id}")
  public ResponseEntity<Void> cancelToken(@PathVariable String id, @RequestHeader(required = false, name = "Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {
    final var token = tokenRepository.findById(id);
    if (token.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    authorizationManager.requireAdmin(authorization);
    var existingToken = token.get();
    existingToken.setStatus(TokenStatus.CANCELLED);

    return ResponseEntity.noContent().build();
  }
}
