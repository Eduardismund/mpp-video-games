package ro.eduardismund.dtos;

import lombok.Data;
import ro.eduardismund.domain.UserMonitorReason;

import java.time.Instant;

@Data
public class UserMonitorResponse {
  private String username;
  private Instant timestampFirst;
  private Instant timestampLast;
  private UserMonitorReason reason;
}
