package ro.eduardismund.domain;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@Data
@ConfigurationProperties("videogames")
public class GenreRepository {
  private List<String> genres = new ArrayList<>();
}
