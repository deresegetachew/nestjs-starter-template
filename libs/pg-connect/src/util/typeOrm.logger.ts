import { Inject, Logger, LoggerService } from '@nestjs/common';
import { Logger as TypeOrmLoggerInterface, QueryRunner } from 'typeorm';
const context = 'TypeORM';

export class TypeOrmLogger implements TypeOrmLoggerInterface {
    constructor(@Inject(Logger) private readonly logger: LoggerService) { }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.debug(`Query: "${query}" -- [${parameters}]`, context);
    }
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.error(`Query error: ${error}, "${query}" -- [${parameters}]`, context);
    }
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        this.logger.warn(`Slow query (${time}): "${query}" -- [${parameters}]`, context);
    }
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        this.logger.log(message, context);
    }
    logMigration(message: string, queryRunner?: QueryRunner) {
        this.logger.log(message, context);
    }

    log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
        switch (level) {
            case 'info':
                this.logger.log(message, context);;
                break;
            case 'log':
                this.logger.verbose(message, context);;
                break;
            case 'warn':
                this.logger.warn(message, context);;
                break;
        }
    }
}