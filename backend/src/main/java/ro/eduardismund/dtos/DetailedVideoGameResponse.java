package ro.eduardismund.dtos;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class DetailedVideoGameResponse {
  private String id;
  private String name;
  private String genre;
  private LocalDate releaseDate;
  private BigDecimal price;
  private String image;
}
