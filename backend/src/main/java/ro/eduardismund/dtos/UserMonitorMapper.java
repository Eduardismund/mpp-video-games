package ro.eduardismund.dtos;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ro.eduardismund.domain.UserMonitor;

@Mapper
public interface UserMonitorMapper {
  @Mapping(target="username", source = "user.username")
  @Mapping(target="timestampFirst", source = "timestamp")
  @Mapping(target="timestampLast", source = "timestamp")
  UserMonitorResponse toResponse(UserMonitor userMonitor);
}
