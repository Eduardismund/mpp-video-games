package ro.eduardismund.dtos;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ro.eduardismund.domain.Token;

@Mapper
public interface TokensMapper {
  @Mapping(target="username", source = "user.username")
  ActiveUserSessionResponse toResponse(Token token);
}
