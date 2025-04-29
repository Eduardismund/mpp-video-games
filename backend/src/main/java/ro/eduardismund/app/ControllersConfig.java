package ro.eduardismund.app;

import org.springframework.context.annotation.Import;
import ro.eduardismund.controllers.*;

@Import({VideoGamesController.class, VideoGameReviewsController.class, VideoGamesStatisticsController.class,
  VideoGamesSubscriptionsController.class, GenresController.class, VideoGameSubscribersManager.class,
  FeaturesToggleController.class, LoginController.class, AuthorizationManager.class, ActionTrailManager.class, UserMonitorController.class, AuthorizationErrorHandlers.class})
public class ControllersConfig {

}
