import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotImplementedException, Logger, Inject, LoggerService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { I18nService } from './i18n.service';

export interface Response<T> {
    data: T;
    message: string[];
    status: number;
}

//this is to translate messages sent back in 200 cases in error cases we are using exceptionFilters
//the reason we are doing error and message separately is because when using guards for cases like auth
//guards run after middleware and before interceptors and if our guards return a response directly 
//and the interceptor wont get a chance to catch the error . therfore instead of doing errors here and in 
//exception filters I dedicded that we handle all errors inside exception filteres instead.

@Injectable()
export class TranslateInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private readonly logger: Logger;

    constructor(private i18nService: I18nService) {
        this.logger = new Logger(TranslateInterceptor.name);
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');
        if (context.getType() === 'http') {
            let res = context.switchToHttp().getResponse();
            let req = context.switchToHttp().getRequest();

            //console.log("***", context.switchToHttp().getResponse());
            //translate messages here
            return next.handle()
                .pipe(map(value => { return { stauts: 200, data: value, message: [] } }))



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
}