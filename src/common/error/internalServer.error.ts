import { I18nError } from 'src/i18n/i18n-error';
import { LogLevel } from 'src/common/logLevel';
import { InternalServerErrorException } from '@nestjs/common';
import commonErrorEnums from './error.enums';

class InternalServerError extends InternalServerErrorException {
    public i18nError: InternalServerErrorI18n;
    constructor(internalMsg?: string[]) {
        super()
        if (internalMsg)
            this.i18nError = new InternalServerErrorI18n(internalMsg ? internalMsg[0] : null, {});
        else
            this.i18nError = new InternalServerErrorI18n(commonErrorEnums.internalServerError, {});
        console.log("%%% internal server error", internalMsg);
    }

}

class InternalServerErrorI18n extends I18nError {
    constructor(message: string, varibales: { [key: string]: string | number } = {}) {
        super(message, varibales, LogLevel.Error);
    }
}


export default InternalServerError;