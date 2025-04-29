package ro.eduardismund.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.eduardismund.domain.VideoGameRepository;
import ro.eduardismund.dtos.StatisticsRequest;
import ro.eduardismund.dtos.StatisticsResponse;

import java.util.Comparator;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/video-games/statistics")
public class VideoGamesStatisticsController {
  private final VideoGameRepository videoGameRepository;

  @PostMapping
  public ResponseEntity<StatisticsResponse> computeStatistics(@RequestBody @Valid StatisticsRequest statistics) {
    var response = new StatisticsResponse();
    if(statistics.getPriceMetrics() != null){
      response.setPriceMetrics(videoGameRepository.getPriceMetrics(statistics.getPriceMetrics()));
    }

    if (statistics.getGenrePopularity() != null) {
      response.setGenrePopularity(videoGameRepository.countPerGenre().entrySet().stream()
        .sorted(
          Comparator.comparing(Map.Entry<String, Integer>::getValue, Comparator.reverseOrder())
            .thenComparing(Map.Entry::getKey)
        )
        .limit(statistics.getGenrePopularity())
        .map(genre -> new StatisticsResponse.PopularGenre(genre.getKey(), genre.getValue()))
        .toList());
    }
    if (statistics.isTotalCount()) {
      response.setTotalCount(videoGameRepository.count());
    }
    if (statistics.isReleaseYears()) {
      response.setReleaseYears(videoGameRepository.countPerReleaseYears()
        .entrySet()
        .stream()
        .map(t -> new StatisticsResponse.ReleaseYear(t.getKey(), t.getValue()))
        .toList());
    }

    return ResponseEntity.ok(response);
  }


}
