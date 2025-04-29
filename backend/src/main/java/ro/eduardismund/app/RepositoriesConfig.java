package ro.eduardismund.app;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ro.eduardismund.domain.*;

@Import({VideoGameRepositoryCustomImpl.class, ActionTrailRepositoryCustomImpl.class})
@EntityScan(basePackageClasses ={VideoGame.class})
@EnableJpaRepositories(basePackageClasses = {VideoGameRepository.class})
@EnableConfigurationProperties({GenreRepository.class})
public class RepositoriesConfig {
}
