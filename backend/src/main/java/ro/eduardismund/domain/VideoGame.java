package ro.eduardismund.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class VideoGame {
  @Id
  @EqualsAndHashCode.Include
  @ToString.Include
  private String id = UUID.randomUUID().toString();
  @Column(nullable = false, unique = true)
  private String name;
  @Column(nullable = false)
  private String genre;
  @Column(nullable = false)
  private LocalDate releaseDate;
  @Column(nullable = false)
  private BigDecimal price;
  private String image;
  @Column(nullable = false)
  private Long nameHashed;
  @ManyToOne(optional = false)
  private User user;


  @OneToMany(mappedBy = "videoGame", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
  private List<VideoGameReview> reviews;

  public void addReview(VideoGameReview review) {
    if (this.reviews == null) {
      this.reviews = new ArrayList<>();
    }
    this.reviews.add(review);
    review.setVideoGame(this);
  }
  public void removeReview(String videoGameReviewId) {
    this.reviews.removeIf(videoGameReview -> videoGameReview.getId().equals(videoGameReviewId));
  }
}

