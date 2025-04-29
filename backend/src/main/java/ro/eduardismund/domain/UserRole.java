package ro.eduardismund.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole {
  USER_ROLE(0),
  ADMIN_ROLE(1);

  private final int value;

}
