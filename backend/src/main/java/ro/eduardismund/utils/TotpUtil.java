package ro.eduardismund.utils;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.time.Instant;

public class TotpUtil {
  private static final String BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  private static final SecureRandom random = new SecureRandom();

  public static String generateBase32Secret(int length) {
    StringBuilder secret = new StringBuilder(length);
    for (int i = 0; i < length; i++) {
      int index = random.nextInt(BASE32_CHARS.length());
      secret.append(BASE32_CHARS.charAt(index));
    }
    return secret.toString();
  }

  public static boolean validateTotp(String base32Secret, String userOTP, int timeStepSeconds, int allowedDrift) {
    long currentTime = Instant.now().getEpochSecond();
    long counter = currentTime / timeStepSeconds;

    for (int i = -allowedDrift; i <= allowedDrift; i++) {
      String generated = generateTotp(base32Secret, counter + i);
      if (generated.equals(userOTP)) {
        return true;
      }
    }
    return false;
  }

  public static String generateTotp(String base32Secret, long timeStep) {
    byte[] key = base32Decode(base32Secret);
    byte[] data = new byte[8];

    for (int i = 7; i >= 0; i--) {
      data[i] = (byte) (timeStep & 0xFF);
      timeStep >>= 8;
    }

    try {
      Mac hmac = Mac.getInstance("HmacSHA1");
      SecretKeySpec keySpec = new SecretKeySpec(key, "HmacSHA1");
      hmac.init(keySpec);
      byte[] hash = hmac.doFinal(data);

      int offset = hash[hash.length - 1] & 0xF;
      int binary =
        ((hash[offset] & 0x7F) << 24) |
        ((hash[offset + 1] & 0xFF) << 16) |
        ((hash[offset + 2] & 0xFF) << 8) |
        (hash[offset + 3] & 0xFF);

      int otp = binary % 1_000_000; // 6-digit code
      return String.format("%06d", otp);

    } catch (Exception e) {
      throw new RuntimeException("Failed to generate Totp", e);
    }
  }

  // Minimal Base32 decode (RFC 4648) without external lib
  public static byte[] base32Decode(String base32) {
    base32 = base32.replace("=", "").toUpperCase();
    byte[] bytes = new byte[base32.length() * 5 / 8];
    int buffer = 0, bitsLeft = 0, count = 0;

    for (char c : base32.toCharArray()) {
      int val = BASE32_CHARS.indexOf(c);
      if (val < 0) throw new IllegalArgumentException("Invalid Base32 char: " + c);
      buffer <<= 5;
      buffer |= val & 31;
      bitsLeft += 5;
      if (bitsLeft >= 8) {
        bytes[count++] = (byte) (buffer >> (bitsLeft - 8));
        bitsLeft -= 8;
      }
    }

    if (count < bytes.length) {
      byte[] shortened = new byte[count];
      System.arraycopy(bytes, 0, shortened, 0, count);
      return shortened;
    }

    return bytes;
  }
}
