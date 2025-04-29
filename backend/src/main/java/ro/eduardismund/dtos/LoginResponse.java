package ro.eduardismund.dtos;

import lombok.Data;
import lombok.experimental.Accessors;

@Accessors(chain = true)
@Data
public class LoginResponse {
  private String token;
  private Integer role;
}
