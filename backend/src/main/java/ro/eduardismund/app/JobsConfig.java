package ro.eduardismund.app;

import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;
import ro.eduardismund.jobs.MonitorUsersJob;

@EnableScheduling
@Import({MonitorUsersJob.class})
public class JobsConfig {
}
