package ro.eduardismund.controllers;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ro.eduardismund.domain.*;
import ro.eduardismund.dtos.LoginStep1Request;
import ro.eduardismund.dtos.LoginResponse;
import ro.eduardismund.dtos.LoginStep2Request;
import ro.eduardismund.dtos.MfaSetupQrCodeRequest;
import ro.eduardismund.utils.TotpUtil;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class LoginController {
  private final UserRepository userRepository;
  private final TokenRepository tokenRepository;

  @PostMapping("/step1")
  public ResponseEntity<LoginResponse> loginStep1(@RequestBody LoginStep1Request request) throws InvalidUsernameOrPasswordException {
    final var user = userRepository.findByUsername(request.getUsername()).filter(u -> u.getPassword().equals(request.getPassword()));
    if (user.isEmpty()) {
      throw new InvalidUsernameOrPasswordException();
    }
    var existingUser = user.get();

    final var token = new Token();
    token.setUser(existingUser);
    token.setToken(UUID.randomUUID().toString());

    final var loginResponse = new LoginResponse();

    switch (existingUser.getMfaStatus()) {
      case ACTIVE: {
        token.setStatus(TokenStatus.PENDING_ACTIVATION);
        token.setMfaSecret(existingUser.getMfaSecret());
        token.setActivateBefore(Instant.now().plus(2, ChronoUnit.MINUTES));

        loginResponse.setNextStep(LoginStep2.MFA);
        break;
      }
      case SETUP_REQUIRED: {
        token.setMfaSecret(TotpUtil.generateBase32Secret(32));
        token.setStatus(TokenStatus.PENDING_ACTIVATION_MFA_SETUP);
        token.setActivateBefore(Instant.now().plus(2, ChronoUnit.MINUTES));

        loginResponse.setNextStep(LoginStep2.SETUP_MFA);
        break;
      }
      case NOT_REQUIRED: {
        token.setStatus(TokenStatus.ACTIVE);
        loginResponse.setRole(existingUser.getRole().ordinal());
        loginResponse.setNextStep(LoginStep2.NONE);
      }
    }

    token.setValidBefore(Instant.now().plus(30, ChronoUnit.MINUTES));
    loginResponse.setToken(token.getToken());

    tokenRepository.save(token);
    return ResponseEntity.ok(loginResponse);
  }

  @Transactional
  @PostMapping("/step2")
  public ResponseEntity<LoginResponse> loginStep2(@RequestBody LoginStep2Request request) throws LoginRequiredException {
    final var token = tokenRepository.findByToken(request.getToken()).filter(t -> t.getStatus() == TokenStatus.PENDING_ACTIVATION || t.getStatus() == TokenStatus.PENDING_ACTIVATION_MFA_SETUP);

    if (token.isEmpty()) {
      throw new LoginRequiredException("Invalid token in login step 2 request");
    }

    final var existingToken = token.get();
    if (!TotpUtil.validateTotp(existingToken.getMfaSecret(), request.getValidationCode(), 30, 5)) {
      throw new LoginRequiredException("Invalid OTP");
    }

    if(existingToken.getStatus() == TokenStatus.PENDING_ACTIVATION_MFA_SETUP) {
      existingToken.getUser().setMfaSecret(existingToken.getMfaSecret());
      existingToken.getUser().setMfaStatus(MfaStatus.ACTIVE);
    }

    existingToken.setStatus(TokenStatus.ACTIVE);

    return ResponseEntity.ok(new LoginResponse().setToken(existingToken.getToken()).setNextStep(LoginStep2.NONE).setRole(existingToken.getUser().getRole().ordinal()));
  }

  public static String getOtpAuthURL(String issuer, String accountName, String secretKey) {
    return String.format("otpauth://totp/%s:%s?secret=%s&issuer=%s",
      issuer, accountName, secretKey, issuer);
  }


  @PostMapping("/mfa-setup/qr")
  public ResponseEntity<Resource> generateQrCodeForMfaSetup(@RequestBody MfaSetupQrCodeRequest request) throws IOException, WriterException, LoginRequiredException {

    var token = tokenRepository.findByToken(request.getToken()).filter(t -> t.getStatus() == TokenStatus.PENDING_ACTIVATION_MFA_SETUP);
    if (token.isEmpty()) {
      throw new LoginRequiredException("Invalid token for QR code");
    }
    var existingToken = token.get();
    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    var authUrl = getOtpAuthURL("video-games", existingToken.getUser().getUsername(), existingToken.getMfaSecret());
    BitMatrix bitMatrix = qrCodeWriter.encode(authUrl, BarcodeFormat.QR_CODE, 300, 300);

    ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
    MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

    return ResponseEntity.ok(new ByteArrayResource(pngOutputStream.toByteArray()));
  }

  @ExceptionHandler(InvalidUsernameOrPasswordException.class)
  public ResponseEntity<Object> handleInvalidUsernameOrPasswordException(InvalidUsernameOrPasswordException ex) {
    return ResponseEntity.status(401).contentType(MediaType.APPLICATION_JSON).body(Map.of("error", "Invalid Username Or Password"));
  }
}
