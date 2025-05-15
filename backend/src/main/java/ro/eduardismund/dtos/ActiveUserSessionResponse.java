package ro.eduardismund.dtos;

import lombok.Data;
import lombok.experimental.Accessors;

import java.time.Instant;

@Data
@Accessors(chain = true)
public class ActiveUserSessionResponse {
  private String id;
  private String username;
  private Instant validBefore;
}
