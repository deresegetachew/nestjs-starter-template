import { InternalServerErrorException } from '@nestjs/common';
import { I18nError, LogLevel } from '../../../shared-types';
import { commonErrorLocaleKey } from '../../localekeys';

/**
 * @description
 * This error should be thrown when some unexpected and exceptional case is encountered.
 * This are usually cases we forgot to handle
 * @docsCategory errors
 * @docsPage Error Types
 */

class InternalServerErrorI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}, messageForDeveloper?: string) {
        super(message, variables, LogLevel.Error, messageForDeveloper);
    }
}

export class InternalServerError extends InternalServerErrorException {
    public I18nError: InternalServerErrorI18n;
    constructor(internalMsg?: string) {
        super()
        this.I18nError = new InternalServerErrorI18n(commonErrorLocaleKey.internalServerError, {}, internalMsg);
    }

}

