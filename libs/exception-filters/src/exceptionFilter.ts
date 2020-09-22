import { PgConnectService } from "@db/pg-connect";
import { formatResponse, I18nError, IAppResponse, InternalServerError, LogLevel } from "@lib/common";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, Logger, LoggerService } from '@nestjs/common';
import { Response } from 'express';
import { I18nRequest, I18nService } from 'src/i18n/i18n.service';


@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    constructor(@Inject(Logger) private readonly logger: LoggerService, private i18nService: I18nService, private pgConnectService: PgConnectService) { }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response<IAppResponse<any>>>();
        const request = ctx.getRequest<I18nRequest>();

        // let tException: I18nError[] = [];
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof InternalServerError) {
            //console.log(exception);
            //this.logger.error(exception.I18nError.messageForDeveloper, exception?.stack);

            this.log(exception);
            const translatedError = this.i18nService.translateError(request, exception.I18nError);

            response.status(status)
                .json(formatResponse(status, [translatedError.message], null));
        }
        else {
            if (exception.query || exception.table) {
                //its a pg errorP
                const handler = this.pgConnectService.exceptionHandler(exception);

                if (handler) {
                    this.logger.warn(`db_error: ${handler.getMessage(exception)}`)
                }
                else {
                    this.logger.error(`db_error:no_handler: ${exception.response}`);
                }

                const internalError = this.pgConnectService.throwPgError(handler.getMessage(exception));
                const translatedError = this.i18nService.translateError(request, internalError.I18nError);

                response.status(status)
                    .json(formatResponse(status, [translatedError.message]));
            }
            else {
                //errors that passed trough our error interceptors
                //or errors from guards or those that are called before interceptors and that threw error

                let message: string[] = [];
                if (Array.isArray(exception)) {
                    exception.forEach((ex) => {
                        if (ex.I18nError) {
                            this.log(ex);

                            const translatedError = this.i18nService.translateError(request, ex.I18nError);
                            message.push(translatedError.message);
                        }
                        else {
                            this.log(ex);

                            if (Array.isArray(ex?.response?.message))
                                message.push(...ex?.response?.message);
                            else {
                                if (ex?.response?.message) {
                                    message.push(ex?.response?.message);
                                }
                                else if (ex?.message) {
                                    message.push(ex?.message);
                                }
                            }
                        }
                    });
                }
                else {

                    if (exception.I18nError) {
                        this.log(exception);


                        const translatedError = this.i18nService.translateError(request, exception.I18nError);
                        //console.log("????", translatedError);
                        message.push(translatedError.message);
                    }
                    else {

                        if (exception instanceof HttpException) {

                            const translatedMessage = this.i18nService.translateHttpException(request, exception)
                            message.push(translatedMessage);
                        }
                        else {
                            //its an error that has not yet been translated
                            this.log(exception);
                            //this.logger.error(`Untranslated Error: ${exception.message} ' Stack: ' ${exception.stack}`)
                            //tException = [...exception];
                            if (Array.isArray(exception?.response?.message))
                                message = [...exception?.response?.message];
                            else {
                                if (exception?.response?.message) {
                                    message.push(exception?.response?.message);
                                }
                                else if (exception?.message) {
                                    message.push(exception?.message);
                                }

                            }
                        }
                    }
                }



                // console.log("####?", exception);
                //const message: string[] = tException.map(te => te?.message).filter((v) => v !== undefined);
                response.status(status).json(formatResponse(status, message, null));
            }
        }
    }

    private log(exception: any) {
        if (exception.I18nError instanceof I18nError) {
            if (exception?.I18nError.logLevel == LogLevel.Error)
                this.logger.error(exception.I18nError.messageForDeveloper, exception?.stack);
            else if (exception?.I18nError.logLevel == LogLevel.Info)
                this.logger.log(exception?.I18nError.logLevel, exception.I18nError.message);
            else if (exception?.I18nError.logLevel == LogLevel.Warning)
                this.logger.warn(exception?.I18nError.logLevel, exception.I18nError.message);
        }
        else {
            //we have an error that is not an instance of I18nError potentially Untranslated 
            this.logger.error(`Untranslated Error: ${exception.message}`, exception.stack)
        }

    }
}