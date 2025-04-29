package ro.eduardismund.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ro.eduardismund.domain.VideoGameListParams;
import ro.eduardismund.domain.VideoGameRepository;
import ro.eduardismund.dtos.*;

import java.math.BigDecimal;
import java.util.Map;

import static ro.eduardismund.domain.Utils.computeVideoGameNameHash;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/video-games")
public class VideoGamesController {
  private final VideoGameRepository videoGameRepository;
  private final VideoGameMapper videoGameMapper;
  private final VideoGameSubscribersManager videoGameSubscribersManager; // 👈 Add this


  @GetMapping
  public ResponseEntity<GetVideoGamesResponse> getAllGames(BigDecimal minPrice, BigDecimal maxPrice, Integer offset, Integer maxItems, String nameEq, Boolean increasing) {
    var params = VideoGameListParams.builder().maxPrice(maxPrice).offset(offset).maxItems(maxItems).minPrice(minPrice).nameEq(nameEq).increasing(increasing).build();
    return ResponseEntity.ok(new GetVideoGamesResponse().setItems(videoGameRepository.streamAll(params).map(videoGameMapper::toResponse).toList()).setTotalCount(videoGameRepository.count(params)));
  }

  @GetMapping("{id}")
  public ResponseEntity<DetailedVideoGameResponse> getVideoGameById(@PathVariable String id) {
    return videoGameRepository.findById(id).map(videoGameMapper::toResponse).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<DetailedVideoGameResponse> createVideoGame(@RequestBody @Valid CreateVideoGameRequest videoGame) throws VideoGameNameTakenException {
    if(videoGameRepository.count(VideoGameListParams.builder().nameEq(videoGame.getName()).build())>0){
      throw new VideoGameNameTakenException(videoGame.getName());
    }
    var videoGameCreated = videoGameMapper.toEntity(videoGame);
    videoGameCreated.setNameHashed(computeVideoGameNameHash(videoGame.getName()));

    var saved = videoGameRepository.save(videoGameCreated);

    videoGameSubscribersManager.notifySubscribers(ActionType.CREATE, videoGameMapper.toResponse(saved));

    var location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(saved.getId())
      .toUri();

    return ResponseEntity.created(location).body(videoGameMapper.toResponse(saved));
  }
  @DeleteMapping("{id}")
  public ResponseEntity<Void> deleteVideoGame(@PathVariable String id) {
    final var game = videoGameRepository.findById(id);
    game.ifPresent(g -> {
      videoGameRepository.delete(g);
      videoGameSubscribersManager.notifySubscribers(ActionType.DELETE,videoGameMapper.toResponse(g));
    });
    return game.<ResponseEntity<Void>>map(g -> ResponseEntity.noContent().build()).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PatchMapping("{id}")
  public ResponseEntity<Void> updateVideoGame(@PathVariable String id, @RequestBody @Valid UpdateVideoGameRequest videoGame) {
    final var existingVideoGame = videoGameRepository.findById(id);
    existingVideoGame.ifPresent(g -> {
      videoGameMapper.copyToEntity(videoGame, g);
      var updated = videoGameRepository.save(g);
      videoGameSubscribersManager.notifySubscribers(ActionType.UPDATE, videoGameMapper.toResponse(updated));

    });
    return existingVideoGame.<ResponseEntity<Void>>map(g -> ResponseEntity.noContent().build()).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @ExceptionHandler(VideoGameNameTakenException.class)
  public ResponseEntity<Object> handleVideoGameNameTakenException(VideoGameNameTakenException ex) {
    log.warn("Video Game Name Conflict : {}", ex.getMessage());
    return ResponseEntity.status(409).contentType(MediaType.APPLICATION_JSON).body(Map.of("error", ex.getMessage()));
  }
}
