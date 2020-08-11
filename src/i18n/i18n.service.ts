
import { Injectable, OnModuleInit, Logger, Inject, LoggerService } from '@nestjs/common';
import { Handler, Request } from 'express';
import i18next, { TFunction, ExistsFunction, i18n } from 'i18next';
import middleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import * as path from 'path';


import { I18nError } from './i18n-error';
import { ConfigService } from '@nestjs/config';
import { pathToFileURL } from 'url';



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

        // console.log("???", originalError)
        if (t && originalError) {

            //console.log("inside t & originalError", originalError.message);
            let translation = originalError.message;

            try {
                console.log('trying????', translation);
                translation = t(originalError.message, originalError.variables);
            } catch (e) {
                console.log("??>>>");
                translation += `(Translation format error: ${e.message})`;
                this.logger.error(translation);
            }

            console.log("@@", JSON.stringify(error));

            error.message = translation;
            // We can now safely remove the variables object so that they do not appear in
            // the error returned by API
            delete originalError.variables;
        }

        //error is not an instance of I18nError
        return error;
    }

    // translateMessage(req: I18nRequest, messageObj: I18nMessage): string {
    //     const t: TFunction = req.t;
    //     let translation = messageObj.message;

    //     if (t && messageObj) {
    //         try {
    //             translation = t(messageObj.message, messageObj.variables);
    //         } catch (e) {
    //             translation += ` (Translation format error: ${e.message})`;
    //             this.logger.error(translation);
    //         }

    //     };



    //     return translation;
    // }

}
