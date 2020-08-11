import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from "./types/ErrorResponse";
import PgExcecptionHandler from './errors/pgErrorHandler';
import { I18nService, I18nRequest } from 'src/i18n/i18n.service';
import { I18nError } from 'src/i18n/i18n-error';
import { LogLevel } from 'src/common/logLevel';
import InternalServerError from 'src/common/error/internalServer.error';


@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    constructor(private i18nService: I18nService, private logger: Logger) { }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response<ErrorResponse>>();
        const request = ctx.getRequest<I18nRequest>();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        //console.log("exception FILTER", JSON.stringify(exception));
        //console.log("::====>", exception);
        if (exception.query || exception.table) {
            //its a pg errorP
            //console.log(JSON.stringify(exception));
            let handler = PgExcecptionHandler(exception);

            if (handler) {
                this.logger.error(handler.getMessage(exception))
            }
            else {
                this.logger.error(exception.response);
            }



            let internalError = new InternalServerError(handler.getMessage(exception));
            const tException = this.i18nService.translateError(request, internalError.i18nError);
            response.status(status).json({
                statusCode: status,
                message: [tException.message]
            })
        }
        else {
            //errors that passed trough our error interceptors
            //or errors from guards or those that are called before interceptors and that threw error
            //use i18nservice to translate messages here
            //also log here
            //console.log("???", this.i18nService.translateError(request, exception.i18nError));

            this.logError(exception);
            const tException = this.i18nService.translateError(request, exception.i18nError);
            response.status(status).json({
                statusCode: status,
                message: [tException.message]
                //message: Array.isArray(exception?.response?.message) ? exception?.response?.message : [exception?.response?.message]
            })
        }
    }

    private logError(exception: any) {
        if (exception.i18nError instanceof I18nError) {
            if (exception?.i18nError.logLevel == LogLevel.Error)
                this.logger.error(exception?.i18nError.logLevel, exception.i18nError);
            else if (exception?.i18nError.logLevel == LogLevel.Info)
                this.logger.log(exception?.i18nError.logLevel, exception.i18nError.messsage);
            else if (exception?.i18nError.logLevel == LogLevel.Warning)
                this.logger.warn(exception?.i18nError.logLeve, exception.i18nError.message);
        }
    }
}