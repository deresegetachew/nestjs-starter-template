import { formatResponse, I18nError, IAppResponse, LogLevel } from "@lib/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, Logger, LoggerService } from '@nestjs/common';
import { Response } from 'express';
import { PgConnectService } from "libs/pg-connect/src";
import InternalServerError from "src/common/error/internalServer.error";
import { I18nRequest, I18nService } from 'src/i18n/i18n.service';


@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    constructor(@Inject(Logger) private readonly logger: LoggerService, private i18nService: I18nService, private pgConnectService: PgConnectService) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response<IAppResponse<any>>>();
        const request = ctx.getRequest<I18nRequest>();


        let tException: I18nError[] = [];
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof InternalServerError) {
            this.logger.error(exception.I18nError.messageForDeveloper, exception?.stack);

            const tException = this.i18nService.translateError(request, exception.I18nError);

            response.status(status)
                .json(formatResponse(status, [tException.message], null));
        }
        else {
            if (exception.query || exception.table) {
                //its a pg errorP
                let handler = this.pgConnectService.exceptionHandler(exception);

                if (handler) {
                    this.logger.warn(`db_error: ${handler.getMessage(exception)}`)
                }
                else {
                    this.logger.error(`db_error:no_handler: ${exception.response}`);
                }

                let internalError = this.pgConnectService.throwPgError(handler.getMessage(exception));

                const tException = this.i18nService.translateError(request, internalError.I18nError);

                response.status(status)
                    .json(formatResponse(status, [tException.message]));
            }
            else {
                //errors that passed trough our error interceptors
                //or errors from guards or those that are called before interceptors and that threw error
                //use i18nservice to translate messages here

                if (Array.isArray(exception)) {
                    tException = exception.map((ex) => {
                        if (ex.I18nError) {
                            return this.i18nService.translateError(request, ex.I18nError);
                        }
                        else {
                            this.logger.error(`Untranslated Error: ${ex.stack}`)
                            return ex;
                        }
                    });
                }
                else {
                    if (exception.I18nError) {
                        tException.push(this.i18nService.translateError(request, exception.I18nError));
                    }
                    else {
                        //its an error that hasnot yet been translated
                        this.logger.error(`Untranslated Error: ${exception.stack}`)
                        //tException = [...exception];
                        if (Array.isArray(exception?.response?.message))
                            tException = exception?.response?.message;
                        else {
                            tException.push(exception?.response?.message);
                        }
                    }
                }

                const message: string[] = tException.map(te => te?.message);
                response.status(status).json(formatResponse(status, message, null));
            }
        }
    }

    private logError(exception: any) {
        if (exception.I18nError instanceof I18nError) {
            if (exception?.I18nError.logLevel == LogLevel.Error)
                this.logger.error(exception?.I18nError.logLevel, exception.I18nError);
            else if (exception?.I18nError.logLevel == LogLevel.Info)
                this.logger.log(exception?.I18nError.logLevel, exception.I18nError.messsage);
            else if (exception?.I18nError.logLevel == LogLevel.Warning)
                this.logger.warn(exception?.I18nError.logLevel, exception.I18nError.message);
        }

    }
}