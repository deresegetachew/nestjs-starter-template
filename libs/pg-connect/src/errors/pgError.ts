import { commonErrorLocaleKey, I18nError, LogLevel } from '@lib/common';
import { UnprocessableEntityException } from '@nestjs/common';

/**
 * @description
 * This error should be when postgress related errors are thrown .
 * for example when unique key conflicts
 * the error codes handeled in this code are found inside  pgErrorLookup
 * @docsCategory errors
 * @docsPage Error Types
 */
class PgError extends UnprocessableEntityException {
    public I18nError: PgErrorI18n;
    constructor(internalMsg?: string[] | string) {
        super()
        if (internalMsg)
            this.I18nError = new PgErrorI18n(internalMsg ? Array.isArray(internalMsg) ? internalMsg[0] : internalMsg : null, {});
        else
            this.I18nError = new PgErrorI18n(commonErrorLocaleKey.internalServerError, {});
    }

}

class PgErrorI18n extends I18nError {
    constructor(message: string, varibales: { [key: string]: string | number } = {}) {
        super(message, varibales, LogLevel.Error);
    }
}


export default PgError;