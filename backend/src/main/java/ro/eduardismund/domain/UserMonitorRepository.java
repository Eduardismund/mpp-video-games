package ro.eduardismund.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.stream.Stream;

public interface UserMonitorRepository extends JpaRepository<UserMonitor, Long> {
 Stream<UserMonitor> streamByTimestampAfter(Instant timestamp);
}
