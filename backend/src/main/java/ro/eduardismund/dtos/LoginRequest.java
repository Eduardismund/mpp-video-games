package ro.eduardismund.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginRequest {
  @NotNull
  private String username;
  @NotNull
  private String password;
}
