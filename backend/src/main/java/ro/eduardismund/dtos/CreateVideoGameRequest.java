package ro.eduardismund.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateVideoGameRequest {
  @NotNull
  @Length(min = 1, max = 250)
  private String name;
  @NotNull
  @Length(min = 1, max = 250)
  private String genre;
  @NotNull
  private LocalDate releaseDate;
  @NotNull
  @Min(0)
  private BigDecimal price;

  private String image;
}
