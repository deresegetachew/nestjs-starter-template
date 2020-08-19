import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PgConnectModule } from 'libs/pg-connect/src';
import { I18nModule } from 'src/i18n/i18n.module';
import { AppExceptionFilter } from './exceptionFilter';
@Module({
  imports: [I18nModule, PgConnectModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    },
    Logger
  ]
})
export class ExceptionFiltersModule { }
