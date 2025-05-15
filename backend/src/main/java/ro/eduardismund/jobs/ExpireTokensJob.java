package ro.eduardismund.jobs;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import ro.eduardismund.domain.TokenRepository;
import ro.eduardismund.domain.TokenStatus;

import java.time.Instant;
import java.util.Set;

@RequiredArgsConstructor
public class ExpireTokensJob {
  private final TokenRepository tokenRepository;

  @Transactional
  @Scheduled(fixedDelay = 10_000)
  public void run() {
    tokenRepository.streamByActivateBeforeBeforeAndStatusIn(Instant.now(), Set.of(TokenStatus.PENDING_ACTIVATION, TokenStatus.PENDING_ACTIVATION_MFA_SETUP))
      .forEach(token -> token.setStatus(TokenStatus.EXPIRED));
    tokenRepository.streamByValidBeforeBeforeAndStatusNot(Instant.now(), TokenStatus.EXPIRED).forEach(
      token -> token.setStatus(TokenStatus.EXPIRED)
    );
  }
}
