package ro.eduardismund.dtos;

import lombok.Data;
import lombok.experimental.Accessors;
import ro.eduardismund.domain.LoginStep2;

@Accessors(chain = true)
@Data
public class LoginResponse {
  private String token;
  private Integer role;
  private LoginStep2 nextStep;
}
