package ro.eduardismund.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ActionTrailRepository extends JpaRepository<ActionTrailItem, Long>, ActionTrailRepositoryCustom {
}
