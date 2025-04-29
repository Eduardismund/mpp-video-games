package ro.eduardismund.jobs;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import ro.eduardismund.domain.ActionTrailRepository;
import ro.eduardismund.domain.UserMonitor;
import ro.eduardismund.domain.UserMonitorReason;
import ro.eduardismund.domain.UserMonitorRepository;

import java.time.Instant;

@RequiredArgsConstructor
public class MonitorUsersJob {
  private final ActionTrailRepository actionTrailRepository;
  private final UserMonitorRepository userMonitorRepository;

  @Transactional
  @Scheduled(fixedDelay = 30_000)
  public void run() {
   actionTrailRepository.findUsersExceedingThreshold(50, 10).forEach(user -> {
     final var userMonitor = new UserMonitor();
     userMonitor.setUser(user);
     userMonitor.setReason(UserMonitorReason.HIGH_FREQUENCY_OPS);
     userMonitor.setTimestamp(Instant.now());
     userMonitorRepository.save(userMonitor);
   });
  }
}
