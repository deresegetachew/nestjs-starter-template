import { Module, Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppExceptionFilter } from './exceptionFilter';
import { ErrorResponse } from "./types/ErrorResponse";
import { I18nModule } from 'src/i18n/i18n.module';
@Module({
  imports: [I18nModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter
    },
    {
      provide: ErrorResponse,
      useClass: ErrorResponse
    },
    Logger
  ],
  exports: [ErrorResponse]
})
export class ExceptionFiltersModule { }
