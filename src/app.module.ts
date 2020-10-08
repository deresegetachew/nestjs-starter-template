// import TypeOrmConfigService from './config/typeOrm.config';
import { ExceptionFiltersModule } from '@app/exception-filters';
import { PgConnectModule, TypeOrmConfigService } from '@db/pg-connect';
import { I18nModule, I18nService } from '@lib/i18n';
import { ValidationPipeModule } from '@lib/validation-pipe';
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterceptorsModule } from 'libs/interceptors/src';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { ClientModule } from './client/client.module';
import appConfig from './config/app.config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    PgConnectModule,
    UserModule,
    ClientModule,
    AuthorizationModule,
    AuthModule,
    I18nModule,
    ExceptionFiltersModule,
    ValidationPipeModule,
    InterceptorsModule
  ],
  providers: [Logger]
})
export class AppModule implements NestModule {
  constructor(private i18nService: I18nService) { }

  configure(consumer: MiddlewareConsumer) {
    const i18nextHandler = this.i18nService.handler(); //this will attach t to request
    //cors, helmet, logger
    consumer.apply(i18nextHandler).forRoutes({ path: "*", method: RequestMethod.ALL });
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
