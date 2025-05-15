package ro.eduardismund.domain;

public enum TokenStatus {
  ACTIVE,
  PENDING_ACTIVATION,
  PENDING_ACTIVATION_MFA_SETUP,
  EXPIRED,
  CANCELLED
}
