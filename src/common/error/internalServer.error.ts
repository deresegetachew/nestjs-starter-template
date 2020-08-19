import { commonErrorLocaleKey, I18nError, LogLevel } from '@lib/common';
import { InternalServerErrorException } from '@nestjs/common';

/**
 * @description
 * This error should be thrown when some unexpected and exceptional case is encountered.
 * This are usually cases we forgot to handle
 * @docsCategory errors
 * @docsPage Error Types
 */
class InternalServerError extends InternalServerErrorException {
    public I18nError: InternalServerErrorI18n;
    constructor(internalMsg?: string) {
        super()
        this.I18nError = new InternalServerErrorI18n(commonErrorLocaleKey.internalServerError, {}, internalMsg);
    }

}

class InternalServerErrorI18n extends I18nError {
    constructor(message: string, varibales: { [key: string]: string | number } = {}, messageForDeveloper?: string) {
        super(message, varibales, LogLevel.Error, messageForDeveloper);
    }
}


export default InternalServerError;