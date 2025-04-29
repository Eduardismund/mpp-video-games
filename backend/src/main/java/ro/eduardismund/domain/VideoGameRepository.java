package ro.eduardismund.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VideoGameRepository extends JpaRepository<VideoGame, String>, VideoGameRepositoryCustom {
}
