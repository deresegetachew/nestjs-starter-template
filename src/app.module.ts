import { Module, OnApplicationBootstrap, Logger, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { ClientModule } from './client/client.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthModule } from './auth/auth.module';
import TypeOrmConfigService from './config/typeOrm.config';
import { ExceptionFiltersModule } from '@app/exception-filters';
import { I18nModule } from './i18n/i18n.module';
import { I18nService } from './i18n/i18n.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    UserModule,
    ClientModule,
    AuthorizationModule,
    AuthModule,
    I18nModule,
    ExceptionFiltersModule,
  ],
  providers: [Logger]
})
export class AppModule implements NestModule {
  constructor(private i18nService: I18nService) { }

  configure(consumer: MiddlewareConsumer) {
    const i18nextHandler = this.i18nService.handler(); //this will attach t to request
    //cors, helmet, logger
    consumer.apply(i18nextHandler).forRoutes("/auth", "/user");
  }




};
// export class AppModule implements OnApplicationBootstrap {
//   async onApplicationBootstrap(): Promise<void> {
//     //1 check if hydra is up and running
//     //if running check if admin is registered as client
//     //if not registered register as a client
//     //check if admin is registered as a client on hydra
//     //2 if hydra is down check if it is configured
//     // if not configured set unconfigured

//     //await this.fetch();
//     throw new Error("Method not implemented.");
//   }

// }
