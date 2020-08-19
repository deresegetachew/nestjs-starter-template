import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { dataValidationExceptionFactory } from './common/dataValidationExceptionFactory';
import loggerConfig from './config/app.logger';





async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: dataValidationExceptionFactory()
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('appConfig.PORT'));
}
bootstrap();

