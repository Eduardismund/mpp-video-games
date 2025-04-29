package ro.eduardismund.domain;

import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import ro.eduardismund.dtos.StatisticsRequest;
import ro.eduardismund.dtos.StatisticsResponse;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class VideoGameRepositoryCustomImpl implements VideoGameRepositoryCustom {
  @PersistenceContext
  private EntityManager em;

  @Override
  public Integer count(VideoGameListParams params) {
    final var videoGame = QVideoGame.videoGame;
    var query = new JPAQuery<>(em).select(videoGame.count()).from(videoGame);
    if (params.getMaxPrice() != null) {
      query = query.where(videoGame.price.loe(params.getMaxPrice()));
    }
    if (params.getMinPrice() != null) {
      query = query.where(videoGame.price.goe(params.getMinPrice()));
    }
    if (params.getNameEq() != null) {
      var crcName = Utils.computeVideoGameNameHash(params.getNameEq());
      query = query.where(videoGame.nameHashed.eq(crcName));
    }
    return Objects.requireNonNull(query.fetchOne()).intValue();
  }

  @Override
  public Stream<VideoGame> streamAll(VideoGameListParams params) {

    final var videoGame = QVideoGame.videoGame;
    var query = new JPAQuery<>(em).select(videoGame).from(videoGame);

    if (params.getMaxPrice() != null) {
      query = query.where(videoGame.price.loe(params.getMaxPrice()));
    }
    if (params.getMinPrice() != null) {
      query = query.where(videoGame.price.goe(params.getMinPrice()));
    }
    if (params.getOffset() != null) {
      query = query.offset(params.getOffset());
    }

    if (Optional.ofNullable(params.getIncreasing()).orElse(true)) {
      query = query.orderBy(videoGame.price.asc(), videoGame.id.asc());
    }else {
      query = query.orderBy(videoGame.price.desc(), videoGame.id.asc());
    }
    if (params.getMaxItems() != null) {
      query = query.limit(params.getMaxItems());
    }
    if (params.getNameEq() != null) {
      var crcName = Utils.computeVideoGameNameHash(params.getNameEq());
      query = query.where(videoGame.nameHashed.eq(crcName));
    }
    return query.stream();
  }


  @Override
  public Map<Integer, Integer> countPerReleaseYears() {
    final var videoGame = QVideoGame.videoGame;
    return new JPAQuery<>(em).select(videoGame.releaseDate.year(), videoGame.count()).from(videoGame).groupBy(videoGame.releaseDate.year()).fetch().stream().collect(Collectors.toMap(t -> Objects.requireNonNull(t.get(0, Integer.class)), t -> Objects.requireNonNull(t.get(1, Long.class)).intValue(), Integer::sum, TreeMap::new));
  }

  @Override
  public Map<String, Integer> countPerGenre() {
    final var videoGame = QVideoGame.videoGame;
    return new JPAQuery<>(em).select(videoGame.genre, videoGame.count()).from(videoGame).groupBy(videoGame.genre).fetch().stream().collect(Collectors.toMap(t -> Objects.requireNonNull(t.get(0, String.class)), t -> Objects.requireNonNull(t.get(1, Long.class)).intValue(), Integer::sum, TreeMap::new));
  }

  @Override
  public StatisticsResponse.Metrics getPriceMetrics(StatisticsRequest.PriceMetrics priceMetrics) {
    List<Integer> percentiles = priceMetrics.getPercentiles();
    boolean appendComma = false;

    var sql = new StringBuilder("""
          SELECT
      """);
    if (priceMetrics.isMin()) {
      sql.append("MIN(price) AS min_price");
      appendComma = true;
    }
    if (priceMetrics.isMax()) {
      if (appendComma) {
        sql.append(", ");
      }
      sql.append("MAX(price) AS max_price");
      appendComma = true;
    }

    for (int p : percentiles) {
      double percentileValue = p / 100.0;
      if (appendComma) {
        sql.append(", ");
      }
      appendComma = true;
      sql.append("PERCENTILE_CONT(").append(percentileValue).append(") WITHIN GROUP (ORDER BY price) AS p").append(p);
    }

    sql.append(" FROM video_game");

    var result = (jakarta.persistence.Tuple) em.createNativeQuery(sql.toString(), jakarta.persistence.Tuple.class).getSingleResult();

    if (result != null) {
      var metrics = new StatisticsResponse.Metrics();

      if (priceMetrics.isMin()) {
        metrics.setMin(Optional.ofNullable(result.get("min_price", BigDecimal.class))
          .map(bd -> bd.setScale(2, RoundingMode.HALF_DOWN))
          .orElse(BigDecimal.ZERO));

      }
      if (priceMetrics.isMax()) {
        metrics.setMax(Optional.ofNullable(result.get("max_price", BigDecimal.class))
          .map(bd -> bd.setScale(2, RoundingMode.HALF_DOWN))
          .orElse(BigDecimal.ZERO));
      }

      var percentileList = new ArrayList<StatisticsResponse.Percentile>();
      for (Integer percentile : percentiles) {
        var val = result.get("p" + percentile, Double.class);
        percentileList.add(new StatisticsResponse.Percentile().setValue(Optional.ofNullable(val).map(BigDecimal::valueOf)
          .map(bd -> bd.setScale(2, RoundingMode.HALF_DOWN)).orElse(BigDecimal.ZERO)).setPercentile(percentile));
      }

      metrics.setPercentiles(percentileList);
      return metrics;
    }

    return new StatisticsResponse.Metrics();
  }

  @Override
  public Stream<VideoGameReview> streamAllReviews(VideoGameReviewListParams params) {
    final var videoGameReview = QVideoGameReview.videoGameReview;
    var query = new JPAQuery<>(em).select(videoGameReview).from(videoGameReview);
    if (params.getVideoGameId() != null) {
      query = query.where(videoGameReview.videoGame.id.eq(params.getVideoGameId()));
    }
    if (params.getMaxScore() != null) {
      query = query.where(videoGameReview.score.loe(params.getMaxScore()));
    }
    if (params.getMinScore() != null) {
      query = query.where(videoGameReview.score.goe(params.getMinScore()));
    }
    if (params.getIncreasingScore() != null) {
      if (params.getIncreasingScore()) {
        query = query.orderBy(videoGameReview.score.asc(), videoGameReview.timestamp.desc());
      } else {
        query = query.orderBy(videoGameReview.score.desc());
      }
    }
    if (params.getIncreasingTimestamp() != null) {
      if (params.getIncreasingTimestamp()) {
        query = query.orderBy(videoGameReview.timestamp.asc());
      } else {
        query = query.orderBy(videoGameReview.timestamp.desc());
      }
    }
    if (params.getTextIncludes() != null) {
      query = query.where(videoGameReview.text.contains(params.getTextIncludes()));
    }
    return query.stream();
  }

  @Override
  public Optional<VideoGameReview> findReviewById(String videoGameId, String reviewId) {
    final var videoGameReview = QVideoGameReview.videoGameReview;
    var query = new JPAQuery<>(em).select(videoGameReview).from(videoGameReview).where(videoGameReview.videoGame.id.eq(videoGameId), videoGameReview.id.eq(reviewId));
    return Optional.ofNullable(query.fetchOne());
  }

}
