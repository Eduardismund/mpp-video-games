package ro.eduardismund.dtos;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateVideoGameReviewRequest {
  private String text;
  @Min(0)
  private int score;
}
