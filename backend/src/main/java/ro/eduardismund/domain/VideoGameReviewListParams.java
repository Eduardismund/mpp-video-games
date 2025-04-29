package ro.eduardismund.domain;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class VideoGameReviewListParams {
  Integer minScore, maxScore;
  String textIncludes, videoGameId;
  Boolean increasingScore, increasingTimestamp;
}
