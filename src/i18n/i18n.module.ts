import { Module, Logger, LoggerService, OnModuleInit } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { TranslateInterceptor } from './translate.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import i18next, { TFunction, ExistsFunction, i18n } from 'i18next';
import middleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [I18nService, {
    provide: APP_INTERCEPTOR,
    useClass: TranslateInterceptor,
  },
    Logger
  ],
  exports: [I18nService]
})
export class I18nModule implements OnModuleInit {
  constructor(private configService: ConfigService) { }
  async onModuleInit() {

    i18next
      .use(middleware.LanguageDetector)
      .use(Backend as any)
      .init({
        preload: ['en', "am"],
        ns: ["common", "glossary"],
        fallbackLng: 'en',
        fallbackNS: ["common", "glossary"],
        detection: {
          lookupQuerystring: 'lang',
          lookupHeader: 'accept-language',
        },
        backend: {
          loadPath: path.resolve(__dirname, '..', '..', 'i18n/locale/{{lng}}/{{ns}}.json')
        },
        initImmediate: true,
        debug: this.configService.get<string>('NODE_ENV') == 'development' ? true : false
      }, (err, t) => {

        console.log("???-->", t("common:error.invalid-credentials"));
      });
  }
}
