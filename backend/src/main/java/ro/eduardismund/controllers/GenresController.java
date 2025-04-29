package ro.eduardismund.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.eduardismund.domain.GenreRepository;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/genres")
public class GenresController {
  private final GenreRepository genreRepository;

  @GetMapping
  public ResponseEntity<List<String>> getGenres() {
    return ResponseEntity.ok(genreRepository.getGenres());
  }
}
