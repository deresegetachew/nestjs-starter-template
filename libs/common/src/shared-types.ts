type SuccessResponse<T> = {
    statusCode: number;
    message: string[];
    data: T;
}

type ErrorResponse<T> = {
    statusCode: number;
    message: string;
    data?: T;
}

export type IAppResponse<T> = SuccessResponse<T> | ErrorResponse<T>;


/**
 * @description this type is used during building a message and to translate it to the appropriate
 * locale. if global it referese to an enviroment variable so we use configService.get(variable)
 * if it is type it will part of the data that was returned so inside our translation interceptor
 * and pick the field and build the message
 */

export enum MessageVarType {
    global = 'global',
    field = 'field'
}


export interface ITransVar {
    [key: string]: {
        type: string,
        tkey: string
    }
}


export enum LogLevel {
    /**
     * @description
     * Log Errors only.
     */
    Error = 0,
    Info = 1,
    Debug = 2,
    Warning = 3,
}


export abstract class I18nError extends Error {
    protected constructor(
        public message: string,
        public variables: { [key: string]: string | number } = {},
        public logLevel: LogLevel,
        public messageForDeveloper?: string,
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}


export interface I18nMessage {
    message: string;
    variables: {
        [key: string]: {
            type: string,
            tkey: string
        }
    },
    logLevel: LogLevel;
}




