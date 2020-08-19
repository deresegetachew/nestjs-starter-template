import { CanActivate, ExecutionContext, Injectable, ValidationPipe } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as ketoAPI from '@oryd/keto-client';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}


const validateRequest = (request: any): boolean => {
  return true;
}
