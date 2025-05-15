package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import ro.eduardismund.domain.UserMonitorRepository;
import ro.eduardismund.dtos.GetUserMonitorsResponse;
import ro.eduardismund.dtos.UserMonitorMapper;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-monitors")
@RequiredArgsConstructor
public class UserMonitorController {
  private final UserMonitorRepository userMonitorRepository;
  private final UserMonitorMapper userMonitorMapper;
  private final AuthorizationManager authorizationManager;

  @GetMapping
  @Transactional(readOnly = true)
  public ResponseEntity<GetUserMonitorsResponse> getUserMonitors(@RequestParam(defaultValue = "1") int timestampOffset, @RequestHeader(required = false, name="Authorization") String authorization) throws LoginRequiredException, UnauthorizedUserException {
    authorizationManager.requireAdmin(authorization);
    final var instantMin = Instant.now().minus(timestampOffset, ChronoUnit.MINUTES);
    final var umStream = userMonitorRepository.streamByTimestampAfter(instantMin).map(userMonitorMapper::toResponse)
      .collect(Collectors.toMap(um -> um.getUsername() + "_" + um.getReason(), Function.identity(), (um1, um2) -> {
        if (um1.getTimestampLast().isBefore(um2.getTimestampLast())) {
          um1.setTimestampLast(um2.getTimestampLast());
        }
        if (um1.getTimestampFirst().isAfter(um2.getTimestampFirst())) {
          um1.setTimestampFirst(um2.getTimestampFirst());
        }
        return um1;
      })).values().stream();
    return ResponseEntity.ok(new GetUserMonitorsResponse().setItems(umStream.toList()));
  }

}
