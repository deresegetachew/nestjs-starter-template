import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { dataValidationExceptionFactory } from './dataValidationExceptionFactory';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          whitelist: true,
          transform: true,
          exceptionFactory: dataValidationExceptionFactory()
        })
      }
    }
  ],
  exports: [],
})
export class ValidationPipeModule { }
