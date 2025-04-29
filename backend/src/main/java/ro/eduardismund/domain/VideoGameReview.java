package ro.eduardismund.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.Instant;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class VideoGameReview {
  @Id
  @EqualsAndHashCode.Include
  @ToString.Include
  private String id = UUID.randomUUID().toString();
  private String text;
  @Column(nullable = false)
  private int score;
  @Column(nullable = false)
  private Instant timestamp;
  @ManyToOne(optional = false)
  private VideoGame videoGame;
  @ManyToOne(optional = false)
  private User user;
}
