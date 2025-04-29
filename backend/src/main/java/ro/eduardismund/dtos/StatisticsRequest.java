package ro.eduardismund.dtos;

import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.List;

@Data
public class StatisticsRequest {

  @Data
  public static class PriceMetrics {
    @Min(0)
    private boolean min;
    private boolean max;
    private List<Integer> percentiles;
  }

  private PriceMetrics priceMetrics;
  private Integer genrePopularity;
  private boolean releaseYears;
  private boolean totalCount;

}
