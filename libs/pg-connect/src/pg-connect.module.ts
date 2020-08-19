import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './config/typeorm.config';
import { PgConnectService } from './pg-connect.service';

@Module({
  providers: [PgConnectService, TypeOrmConfigService],
  exports: [PgConnectService, TypeOrmConfigService],
})
export class PgConnectModule { }
