package ro.eduardismund.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.Instant;


@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class UserMonitor {
  @EqualsAndHashCode.Include
  @ToString.Include
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false)
  private User user;
  @Column(nullable = false)
  private Instant timestamp;
  @Column(nullable = false)
  private UserMonitorReason reason;
}
