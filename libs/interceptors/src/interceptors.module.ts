import { I18nModule } from '@lib/i18n';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TranslateInterceptor } from './translation/translate.Interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TranslateInterceptor
    },
  ],
  exports: [],
  imports: [I18nModule]
})
export class InterceptorsModule { }
