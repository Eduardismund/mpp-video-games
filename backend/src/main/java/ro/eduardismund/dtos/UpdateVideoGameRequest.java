package ro.eduardismund.dtos;

import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateVideoGameRequest {
  private String genre;
  private LocalDate releaseDate;
  @Min(0)
  private BigDecimal price;
  private String image;
}
