import { I18nMessage, IAppResponse } from '@lib/common';
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { I18nRequest, I18nService } from '../i18n.service';


//this is to translate messages sent back in 200 cases in error cases we are using exceptionFilters
//the reason we are doing error and message separately is because when using guards for cases like auth
//guards run after middleware and before interceptors and if our guards return a response directly 
//and the interceptor wont get a chance to catch the error . therfore instead of doing errors here and in 
//exception filters I dedicded that we handle all errors inside exception filteres instead.

//since interceptors use First-IN-Last-Out model
//since this is globall it will be run after route -> controller interceptors

@Injectable()
export class TranslateInterceptor<T> implements NestInterceptor<T, IAppResponse<T>> {
    private readonly logger: Logger;

    constructor(private reflector: Reflector, private i18nService: I18nService, private configService: ConfigService) {
        this.logger = new Logger(TranslateInterceptor.name);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<IAppResponse<T>> {
        if (context.getType() === 'http') {
            let res = context.switchToHttp().getResponse();
            let req = context.switchToHttp().getRequest();
            let status = context.switchToHttp();

            //asumption in this is only for intercepting non error messages
            //translate messages here
            console.log("??**", res.statusCode,)



            if (res.statusCode < 400) {
                console.log("--->?", this.reflector.get<I18nMessage[]>('successMsg', context.getHandler()));


                const successMsg: I18nMessage[] = this.reflector.get<I18nMessage[]>("successMsg", context.getHandler());

                return next.handle()
                    .pipe(map(value => {
                        return {
                            statusCode: res.statusCode,
                            data: value,
                            message: successMsg.map((_msg) => this.i18nService.translateMessage(req, _msg, value))
                        }
                    }));
            }

            return next.handle();




            // if (res.status < 400) {
            //     //message is message
            //     //translate the message

            //     return next.handle()
            //         .pipe(map(value => { console.log("??", value); return { stauts: 200, data: value, message: [] } }))
            // }
            // else {
            //     //message is error
            //     //translate the error
            //     return next.handle().pipe(map(value => { console.log("???", value); return value; }))
            // }

            // return next
            //     .handle()
            //     .pipe(map((data,message,status) => ({data,message,status})));
            // /  //tap(() => console.log(`After... ${Date.now() - now}ms`)),
        }
        else if (context.getType() === 'rpc') {
            throw new NotImplementedException();
        }
    }

    translateMessage(request: I18nRequest, msg: I18nMessage) {

    }
}