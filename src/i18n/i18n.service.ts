
import { I18nError, I18nMessage, MessageVarType } from '@lib/common';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Handler, Request } from 'express';
import i18next, { ExistsFunction, TFunction } from 'i18next';
import middleware from 'i18next-http-middleware';




export interface I18nRequest extends Request {
    t: TFunction;
    exists: ExistsFunction;
    language: string;
    languages: string[];
    dir(lng?: string): 'ltr' | 'rtl';
}



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

    /**
    * Translates the originalError if it is an instance of I18nError.
    */
    translateError(req: I18nRequest, error: I18nError): I18nError {
        const originalError = error;
        const t: TFunction = req.t;


        if (t && originalError) {

            // console.log("**&", JSON.stringify(originalError));
            //console.log("inside t & originalError", originalError.message);
            let translation = originalError.message;

            try {
                translation = t(originalError.message, originalError.variables);
            } catch (e) {
                translation += `(Translation format error: ${e.message})`;
                this.logger.error(translation);
            }

            //console.log("@@", JSON.stringify(error));

            error.message = translation;
            // We can now safely remove the variables object so that they do not appear in
            // the error returned by API
            delete originalError.variables;
        }

        //error is not an instance of I18nError
        return error;
    }

    translateMessage(req: I18nRequest, messageObj: I18nMessage, data: any): string {
        const t: TFunction = req.t;
        const originalMessage = messageObj;


        if (t && originalMessage) {
            let translation: string = originalMessage.message;

            try {
                //extract variables
                let extractVar: { [k: string]: string | number } = {};


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

                console.log("@@##", extractVar);

                translation = t(originalMessage.message, extractVar);
            } catch (e) {
                translation += ` (Translation format error: ${e.message})`;
                this.logger.error(translation);
            }

            return translation;
        }
        return "";
    }

}
