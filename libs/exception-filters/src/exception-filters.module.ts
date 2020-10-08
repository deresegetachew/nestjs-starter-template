import { PgConnectModule } from '@db/pg-connect';
import { I18nModule } from '@lib/i18n';
import { Logger, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
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
