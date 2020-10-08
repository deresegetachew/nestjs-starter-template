import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';

@Module({
  imports: [ConfigModule],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService]
})
export class ClientModule { }
