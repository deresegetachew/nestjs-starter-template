import { Module } from '@nestjs/common';

import { AuthorizationService } from './authorization.service';

@Module({
  imports: [],
  exports: [],
  controllers: [],
  providers: [AuthorizationService]
})
export class AuthorizationModule { }
