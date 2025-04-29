package ro.eduardismund.domain;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class VideoGameListParams {
  BigDecimal minPrice, maxPrice;
  Integer offset, maxItems;
  String nameEq;
  Boolean increasing;
}
