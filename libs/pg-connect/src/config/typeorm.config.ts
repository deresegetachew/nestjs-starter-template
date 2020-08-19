import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { TypeOrmLogger } from '../util/typeOrm.logger';

@Injectable()
export class
    TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) { };

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: this.configService.get('DB_HOST'),
            port: +this.configService.get<number>('DB_PORT'),
            username: this.configService.get('DB_USER'),
            password: this.configService.get('DB_PASSWORD'),
            database: this.configService.get('DB_NAME'),
            autoLoadEntities: true,
            synchronize: this.configService.get('NODE_ENV') != 'production',
            logger: new TypeOrmLogger(new Logger())
        }
    }
}


