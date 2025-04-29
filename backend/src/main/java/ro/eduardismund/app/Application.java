package ro.eduardismund.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication

@Import({ControllersConfig.class, RepositoriesConfig.class, MappersConfig.class, JobsConfig.class})
public class Application {


  public static void main(String[] args) {
    SpringApplication.run(Application.class, args);
  }
}
