package ro.eduardismund.dtos;

import org.mapstruct.*;
import ro.eduardismund.domain.VideoGame;
import ro.eduardismund.domain.VideoGameReview;

@Mapper
public interface VideoGameReviewsMapper {
  VideoGameReviewResponse toResponse(VideoGameReview videoGameReview);

  @Mapping(target = "items", source = "reviews")
  GetVideoGameReviewsResponse toResponse(VideoGame videoGame);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "timestamp", ignore = true)
  @Mapping(target = "videoGame", ignore = true)
  VideoGameReview toEntity(CreateVideoGameReviewRequest review);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "timestamp", ignore = true)
  @Mapping(target = "videoGame", ignore = true)
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void copyToEntity(UpdateVideoGameReviewRequest dto, @MappingTarget VideoGameReview entity);

}
