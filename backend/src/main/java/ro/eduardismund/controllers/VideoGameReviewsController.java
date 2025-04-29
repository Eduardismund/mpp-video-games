package ro.eduardismund.controllers;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ro.eduardismund.domain.ActionTrailType;
import ro.eduardismund.domain.VideoGameRepository;
import ro.eduardismund.domain.VideoGameReviewListParams;
import ro.eduardismund.dtos.*;

import java.time.Instant;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/video-games/{id}/reviews")
public class VideoGameReviewsController {
  private final AuthorizationManager authorizationManager;
  private final VideoGameRepository videoGameRepository;
  private final VideoGameReviewsMapper videoGameReviewsMapper;
  private final ActionTrailManager actionTrailManager;

  @GetMapping("{reviewId}")
  public ResponseEntity<VideoGameReviewResponse> getVideoGameReviewByReviewId(@PathVariable String id, @PathVariable String reviewId) {
    return videoGameRepository.findReviewById(id, reviewId).map(videoGameReviewsMapper::toResponse).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<GetVideoGameReviewsResponse> getVideoGameReviewsById(@PathVariable String id, Integer minScore, Integer maxScore, String textIncludes, Boolean increasingScore, Boolean increasingTimestamp) {
    var params = VideoGameReviewListParams.builder().minScore(minScore).maxScore(maxScore).increasingScore(increasingScore).increasingTimestamp(increasingTimestamp).textIncludes(textIncludes).videoGameId(id).build();
    return ResponseEntity.ok(new GetVideoGameReviewsResponse().setItems(videoGameRepository.streamAllReviews(params).map(videoGameReviewsMapper::toResponse).toList()));
  }

  @PostMapping
  @Transactional
  public ResponseEntity<VideoGameReviewResponse> createVideoGameReview(@PathVariable String id, @RequestBody @Valid CreateVideoGameReviewRequest review, @RequestHeader(required = false, name = "Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {
    var user = authorizationManager.resolveUser(authorization);
    var videoGame = videoGameRepository.findById(id);
    if (videoGame.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    final var createdReview = videoGameReviewsMapper.toEntity(review);
    createdReview.setTimestamp(Instant.now());
    createdReview.setUser(user);
    videoGame.get().addReview(createdReview);

    var location = ServletUriComponentsBuilder
      .fromCurrentRequest()
      .path("/{id}")
      .buildAndExpand(createdReview.getId())
      .toUri();

    actionTrailManager.logAction(ActionTrailType.CREATE_VIDEO_GAME_REVIEW, createdReview.getUser());

    return ResponseEntity.created(location).body(videoGameReviewsMapper.toResponse(createdReview));
  }


  @PatchMapping("{reviewId}")
  @Transactional
  public ResponseEntity<Void> updateVideoGameReview(@PathVariable String id, @PathVariable String reviewId, @RequestBody @Valid UpdateVideoGameReviewRequest reviewRequest, @RequestHeader(required = false, name = "Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {

    var videoGameReview = videoGameRepository.findReviewById(id, reviewId);
    if (videoGameReview.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    var existingReview = videoGameReview.get();

    authorizationManager.requireUser(authorization, existingReview.getUser().getId());

    videoGameReviewsMapper.copyToEntity(reviewRequest, existingReview);

    actionTrailManager.logAction(ActionTrailType.UPDATE_VIDEO_GAME_REVIEW, existingReview.getUser());


    return ResponseEntity.noContent().build();
  }


  @DeleteMapping("{reviewId}")
  @Transactional
  public ResponseEntity<Void> deleteVideoGameReview(@PathVariable String id, @PathVariable String reviewId, @RequestHeader(required = false, name = "Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {

    var videoGameReview = videoGameRepository.findReviewById(id, reviewId);
    if (videoGameReview.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    var existingReview = videoGameReview.get();

    authorizationManager.requireUser(authorization, existingReview.getUser().getId());
    existingReview.getVideoGame().removeReview(reviewId);

    actionTrailManager.logAction(ActionTrailType.DELETE_VIDEO_GAME_REVIEW, existingReview.getUser());

    return ResponseEntity.noContent().build();
  }


}
