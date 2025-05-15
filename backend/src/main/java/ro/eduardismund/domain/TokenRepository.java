package ro.eduardismund.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

public interface TokenRepository  extends JpaRepository<Token, String> {
    Optional<Token> findByToken(String token);
    Stream<Token> streamByActivateBeforeBeforeAndStatusIn(Instant date, Set<TokenStatus> status);
    Stream<Token> streamByValidBeforeBeforeAndStatusNot(Instant date, TokenStatus status);
    Stream<Token> streamByStatus(TokenStatus status);

}
