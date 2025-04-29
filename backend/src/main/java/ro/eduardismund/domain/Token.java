package ro.eduardismund.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Token {
  @Id
  @EqualsAndHashCode.Include
  @ToString.Include
  private String id = UUID.randomUUID().toString();
  @ManyToOne(optional = false)
  private User user;
  @Column(nullable = false)
  private String token;
}
