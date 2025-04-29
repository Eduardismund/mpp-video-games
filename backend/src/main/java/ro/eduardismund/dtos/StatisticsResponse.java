package ro.eduardismund.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.util.List;

@Data
public class StatisticsResponse {


  @Accessors(chain = true)
  @Data
  public static class Percentile {
    @JsonProperty("p")
    private Integer percentile;
    @JsonProperty("v")
    private BigDecimal value;
  }

  @Data
  @Accessors(chain = true)
  public static class Metrics {
    private BigDecimal min;
    private BigDecimal max;
    private List<Percentile> percentiles;
  }

  @Data
  @AllArgsConstructor
  public static class ReleaseYear {
    private int year;
    private int count;
  }

  @Data
  @AllArgsConstructor
  public static class PopularGenre {
    private String genre;
    private int count;
  }

  private Metrics priceMetrics;
  private List<PopularGenre> genrePopularity;
  private List<ReleaseYear> releaseYears;
  private Long totalCount;

}
