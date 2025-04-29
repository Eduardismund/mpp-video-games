package ro.eduardismund.dtos;

import lombok.Data;

import java.time.Instant;

@Data
public class VideoGameReviewResponse {
  private String id ;
  private String text;
  private int score;
  private Instant timestamp;
}
