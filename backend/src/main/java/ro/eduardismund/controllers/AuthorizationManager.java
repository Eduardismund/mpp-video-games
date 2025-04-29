package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import ro.eduardismund.domain.TokenRepository;
import ro.eduardismund.domain.User;
import ro.eduardismund.domain.UserRole;

@RequiredArgsConstructor
public class AuthorizationManager {
  private final TokenRepository tokenRepository;
  public User resolveUser(String tokenString) throws LoginRequiredException, UnauthorizedUserException {
    if(tokenString == null){
      throw new LoginRequiredException();
    }

    var token = tokenRepository.findByToken(tokenString);
    if(token.isEmpty()){
      throw new UnauthorizedUserException();
    }

    return token.get().getUser();
  }

  public void requireUser(String token, String userId) throws LoginRequiredException, UnauthorizedUserException {
    final var user = resolveUser(token);
    if(!user.getId().equals(userId) ||  user.getRole() != UserRole.USER_ROLE){
      throw new UnauthorizedUserException();
    }
  }
  public void requireAdmin(String token) throws LoginRequiredException, UnauthorizedUserException {
    final var user = resolveUser(token);
    if(user.getRole() != UserRole.ADMIN_ROLE){
      throw new UnauthorizedUserException();
    }
  }
}
