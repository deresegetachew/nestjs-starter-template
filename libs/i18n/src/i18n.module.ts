import { Inject, Logger, LoggerService, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import * as path from 'path';
import { I18nService } from './i18n.service';

@Module({
  providers: [I18nService, Logger],
  exports: [I18nService],
})
export class I18nModule implements OnModuleInit {
  constructor(private configService: ConfigService, @Inject(Logger) private readonly logger: LoggerService) { }


  onModuleInit() {
    this.initI18n();
  }

  private initI18n() {
    i18next
      .use(middleware.LanguageDetector)
      .use(Backend as any)
      .init({
        preload: ['en', "am"],
        ns: ["common", "glossary", "dto"],
        fallbackLng: 'en',
        fallbackNS: ["common", "glossary", "dto"],
        detection: {
          lookupQuerystring: 'lang',
          lookupHeader: 'accept-language',
        },
        backend: {
          loadPath: path.resolve(__dirname, '..', '..', '..', 'assets/i18n/{{lng}}/{{ns}}.json')
        },
        initImmediate: true,
        debug: false // this.configService.get<string>('NODE_ENV') == 'development' ? true : false
      }, (err, t) => {
        console.log(i18next.t);
        if (err)
          this.logger.error(`translation error: ${err}`);
      });
  }
}
