package ro.eduardismund.domain;

import ro.eduardismund.dtos.StatisticsRequest;
import ro.eduardismund.dtos.StatisticsResponse;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

public interface VideoGameRepositoryCustom {
  Integer count(VideoGameListParams params);
  Stream<VideoGame> streamAll(VideoGameListParams params);
  Map<Integer, Integer> countPerReleaseYears();
  Map<String, Integer> countPerGenre();
  StatisticsResponse.Metrics getPriceMetrics(StatisticsRequest.PriceMetrics pricemetrics);
  Stream<VideoGameReview> streamAllReviews(VideoGameReviewListParams params);
  Optional<VideoGameReview> findReviewById(String videoGameId, String reviewId);
}
