package ro.eduardismund.app;

import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import ro.eduardismund.dtos.TokensMapper;
import ro.eduardismund.dtos.UserMonitorMapper;
import ro.eduardismund.dtos.VideoGameMapper;
import ro.eduardismund.dtos.VideoGameReviewsMapper;

public class MappersConfig {
  @Bean
  public VideoGameMapper videoGameMapper(){
    return Mappers.getMapper(VideoGameMapper.class);
  }
  @Bean
  public VideoGameReviewsMapper videoGameReviewsMapper(){
    return Mappers.getMapper(VideoGameReviewsMapper.class);
  }

  @Bean
  public UserMonitorMapper userMonitorMapper(){
    return Mappers.getMapper(UserMonitorMapper.class);
  }
  @Bean
  public TokensMapper tokensMapper(){
    return Mappers.getMapper(TokensMapper.class);
  }
}
