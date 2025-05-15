package ro.eduardismund.dtos;

import lombok.Data;

@Data
public class LoginStep2Request {
  private String token;
  private String validationCode;
}
