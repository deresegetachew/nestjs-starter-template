import { LogLevel } from "@nestjs/common"

export interface IPgMessages {
    [k: string]: {
        getMessage: IBuildErrorMessage;
    }
};


export type IBuildErrorMessage = {
    (args: IPgError): string[];
}


export type IPgError = {
    "message": string,
    "severity": string,
    "code": string,
    "detail": string,
    "schema": string,
    "table": string,
    "query": string,
    "parameters": string[]
}

/** reference this for locale enum list
 * https://github.com/anton-bot/locale-enum/blob/master/index.ts
 */
export enum Locale {
    en = 'en_US',
}



