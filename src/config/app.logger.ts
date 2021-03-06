import { LogLevel } from '@lib/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';


const { combine, timestamp, label, prettyPrint, printf } = winston.format;


// Ignore log messages if they have { private: true }
const ignorePrivate = winston.format((info, opts) => {
    if (info.private) { return false; }
    return info;
});

//in different env we might want
//the errors piped to different mediums in dev -> console , in produciton -> something else
// const transportFactory = (configService: ConfigService): winston.transport[] => {
//     if (process.env.NODE_ENV == 'production')
//         return [
//             new winston.transports.Console({
//                 format: winston.format.combine(
//                     winston.format.timestamp(),
//                     nestWinstonModuleUtilities.format.nestLike(),
//                 ),
//             })];
//     else
//         return [
//             new winston.transports.Console({
//                 format: winston.format.combine(
//                     winston.format.timestamp(),
//                     nestWinstonModuleUtilities.format.nestLike(),
//                 ),
//             }),]
// }


const loggerConfig = WinstonModule.createLogger({
    levels: {
        error: LogLevel.Error,
        info: LogLevel.Info,
        debug: LogLevel.Debug,
        warn: LogLevel.Warning
    },
    level: process.env.NODE_ENV == 'production' ? 'info' : 'error',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(),
            ),
        }),],
    exceptionHandlers: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        ignorePrivate()
    )
});


export default loggerConfig;