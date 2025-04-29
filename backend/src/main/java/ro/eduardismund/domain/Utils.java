package ro.eduardismund.domain;

import lombok.experimental.UtilityClass;

import java.util.zip.CRC32;

@UtilityClass
public class Utils {
  public static Long computeVideoGameNameHash(String videoGameName) {
    var sanitized = videoGameName.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();

    CRC32 crc = new CRC32();
    crc.update(sanitized.getBytes());

    return  crc.getValue();
  }
}
