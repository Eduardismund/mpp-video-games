package ro.eduardismund.domain;

import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class ActionTrailRepositoryCustomImpl implements ActionTrailRepositoryCustom {
  @PersistenceContext
  private EntityManager em;

  @Override
  public List<User> findUsersExceedingThreshold(int threshold, int timestampOffset) {
    final var actionTrailItem = QActionTrailItem.actionTrailItem;
    var query = new JPAQuery<>(em).select(actionTrailItem.count(), actionTrailItem.user)
      .from(actionTrailItem)
      .where(actionTrailItem.timestamp.after(Instant.now().minus(timestampOffset, ChronoUnit.SECONDS)))
      .groupBy(actionTrailItem.user)
      .having(actionTrailItem.count().goe(threshold));
    return query.stream().map(q -> q.get(actionTrailItem.user)).toList();
  }
}
