package ro.eduardismund.domain;

import java.util.List;

public interface ActionTrailRepositoryCustom {
  List<User> findUsersExceedingThreshold(int threshold, int timestampOffset);
}
