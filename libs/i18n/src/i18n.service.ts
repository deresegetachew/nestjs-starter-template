import { I18nError, I18nMessage, I18nRequest, MessageVarType } from '@lib/common';
import { HttpException, Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Handler } from 'express';
import i18next, { TFunction } from 'i18next';
import middleware from 'i18next-http-middleware';

/**
 * This service is responsible for translating messages from the server before they reach the client.
 * The `i18next-http-middleware` middleware detects the client's preferred language based on
 * the `Accept-Language` header or "lang" query param and adds language-specific translation
 * functions to the Express request / response objects.
 */


@Injectable()
export class I18nService {
    constructor(@Inject(Logger) private readonly logger: LoggerService, private configService: ConfigService) { }


    handler(): Handler {
        return middleware.handle(i18next);
    }

    translateError(req: I18nRequest, error: I18nError): I18nError {
        const errorCopy = {
            message: error?.message, variables: error?.variables,
            logLevel: error?.logLevel, name: error?.name,
            stack: error?.stack, messageForDeveloper: error?.messageForDeveloper
        }
        const t: TFunction = req.t;

        //console.log("@@@", t);
        if (t && error) {

            // console.log("**&", JSON.stringify(originalError));
            //console.log("inside t & originalError", originalError.message);
            let translation = errorCopy.message;

            try {
                translation = t(errorCopy.message, errorCopy.variables);
            } catch (e) {
                translation += `(Translation format error: ${e.message})`;
                this.logger.error(translation);
            }



            errorCopy.message = translation;
            // We can now safely remove the variables object so that they do not appear in
            // the error returned by API
            delete errorCopy.variables;

            return errorCopy;
        }
        else
            return error;
    }

    translateMessage(req: I18nRequest, messageObj: I18nMessage, data: any): string {
        const t: TFunction = req.t;
        const originalMessage = messageObj;

        if (t && originalMessage) {
            let translation: string = originalMessage.message;

            try {
                //extract variables
                const extractVar: { [k: string]: string | number } = {};

                if (Object.keys(originalMessage.variables).length > 0) {

                    for (const key in originalMessage.variables) {
                        if (originalMessage.variables.hasOwnProperty(key)) {
                            const element = originalMessage.variables[key];

                            if (element.type == MessageVarType.global) {
                                extractVar[element.tkey] = this.configService.get(key);
                            }
                            else if (element.type == MessageVarType.field) {
                                extractVar[element.tkey] = data[key];
                            }

                        }
                    }
                }

                translation = t(originalMessage.message, extractVar);

                console.log("*****-", originalMessage.message, extractVar, translation);
            } catch (e) {
                translation += ` (Translation format error: ${e.message})`;
                this.logger.error(translation);
            }

            return translation;
        }
        return "";
    }

    translateHttpException(req: I18nRequest, exception: HttpException): string {
        const t: TFunction = req.t;
        let translation;
        if (t && exception) {
            translation = exception.message;
            try {
                translation = t('common:httpExceptions.' + exception.getStatus());
            } catch (e) {
                this.logger.error(`(Translation format error: ${e.message})`);
            }
        }
        return translation;
    }
}
