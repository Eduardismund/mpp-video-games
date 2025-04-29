package ro.eduardismund.dtos;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

@Data
@Accessors(chain = true)
public class GetVideoGameReviewsResponse {
  private List<VideoGameReviewResponse> items;
}
