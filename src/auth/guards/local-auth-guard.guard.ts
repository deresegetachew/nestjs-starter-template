import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';


/**
 * @description Guards are executed after each middleware, but before any interceptor or pipe.
 *  therefore our error interceptor will miss this instead when we throw an error it will go
 * directly to our exception filter 
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {

}
