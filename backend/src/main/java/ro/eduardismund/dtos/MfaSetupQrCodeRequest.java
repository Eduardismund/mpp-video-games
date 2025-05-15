package ro.eduardismund.dtos;

import lombok.Data;

@Data
public class MfaSetupQrCodeRequest {
  private String token;
}
