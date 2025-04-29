package ro.eduardismund.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ro.eduardismund.domain.ActionTrailType;
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
  private final AuthorizationManager authorizationManager;
  private final VideoGameMapper videoGameMapper;
  private final VideoGameSubscribersManager videoGameSubscribersManager;
  private final ActionTrailManager actionTrailManager;


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
  public ResponseEntity<DetailedVideoGameResponse> createVideoGame(@RequestBody @Valid CreateVideoGameRequest videoGame, @RequestHeader(required = false, name = "Authorization") String authorization) throws VideoGameNameTakenException, LoginRequiredException, UnauthorizedUserException {

    if (videoGameRepository.count(VideoGameListParams.builder().nameEq(videoGame.getName()).build()) > 0) {
      throw new VideoGameNameTakenException(videoGame.getName());
    }
    var videoGameCreated = videoGameMapper.toEntity(videoGame);
    videoGameCreated.setNameHashed(computeVideoGameNameHash(videoGame.getName()));
    final var user = authorizationManager.resolveUser(authorization);
    videoGameCreated.setUser(user);
    authorizationManager.requireUser(authorization, user.getId());

    var saved = videoGameRepository.save(videoGameCreated);

    videoGameSubscribersManager.notifySubscribers(ActionType.CREATE, videoGameMapper.toResponse(saved));

    var location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(saved.getId()).toUri();

    actionTrailManager.logAction(ActionTrailType.CREATE_VIDEO_GAME, videoGameCreated.getUser());

    return ResponseEntity.created(location).body(videoGameMapper.toResponse(saved));
  }

  @DeleteMapping("{id}")
  public ResponseEntity<Void> deleteVideoGame(@PathVariable String id, @RequestHeader(required = false, name = "Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {

    final var game = videoGameRepository.findById(id);
    if (game.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    var existingGame = game.get();
    authorizationManager.requireUser(authorization, existingGame.getUser().getId());

    videoGameRepository.delete(existingGame);
    videoGameSubscribersManager.notifySubscribers(ActionType.DELETE, videoGameMapper.toResponse(existingGame));
    actionTrailManager.logAction(ActionTrailType.DELETE_VIDEO_GAME, existingGame.getUser());

    return ResponseEntity.noContent().build();
  }

  @PatchMapping("{id}")
  public ResponseEntity<Void> updateVideoGame(@PathVariable String id, @RequestBody @Valid UpdateVideoGameRequest videoGame, @RequestHeader(required = false, name = "Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {
    final var game = videoGameRepository.findById(id);
    if (game.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    var existingGame = game.get();
    authorizationManager.requireUser(authorization, existingGame.getUser().getId());

    videoGameMapper.copyToEntity(videoGame, existingGame);
    var updated = videoGameRepository.save(existingGame);
    videoGameSubscribersManager.notifySubscribers(ActionType.UPDATE, videoGameMapper.toResponse(updated));
    actionTrailManager.logAction(ActionTrailType.CREATE_VIDEO_GAME, updated.getUser());

    return ResponseEntity.noContent().build();
  }

  @ExceptionHandler(VideoGameNameTakenException.class)
  public ResponseEntity<Object> handleVideoGameNameTakenException(VideoGameNameTakenException ex) {
    log.warn("Video Game Name Conflict : {}", ex.getMessage());
    return ResponseEntity.status(409).contentType(MediaType.APPLICATION_JSON).body(Map.of("error", ex.getMessage()));
  }

}
