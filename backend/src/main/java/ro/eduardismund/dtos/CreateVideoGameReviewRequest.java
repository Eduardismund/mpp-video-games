package ro.eduardismund.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateVideoGameReviewRequest {
  @Size(min = 1, max = 50)
  private String text;
  @Min(0)
  @Max(10)
  private int score;
}
