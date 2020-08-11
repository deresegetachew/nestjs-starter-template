import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { configureI18n } from './config/i18n.config';
import { ValidationError } from 'class-validator';
import * as winston from 'winston';
import loggerConfig from './config/logger/app.logger';





async function bootstrap() {
  const { combine, timestamp, label, prettyPrint, printf } = winston.format;


  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig
  });


  const configService = app.get(ConfigService);


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(
    app.get(Reflector))
  );

  await app.listen(configService.get<number>('appConfig.PORT'));
}
bootstrap();
