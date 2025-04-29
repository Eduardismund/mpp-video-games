package ro.eduardismund.dtos;

import org.mapstruct.*;
import ro.eduardismund.domain.VideoGame;

@Mapper
public interface VideoGameMapper {

  // Request DTO to Entity
  @Mapping(target="id", ignore = true)
  @Mapping(target="reviews", ignore = true)
  VideoGame toEntity(CreateVideoGameRequest dto);

  @Mapping(target="id", ignore = true)
  @Mapping(target="name", ignore = true)
  @Mapping(target="reviews", ignore = true)
  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void copyToEntity(UpdateVideoGameRequest dto, @MappingTarget VideoGame entity);

  // Entity to Response DTO
  DetailedVideoGameResponse toResponse(VideoGame videoGame);
}
