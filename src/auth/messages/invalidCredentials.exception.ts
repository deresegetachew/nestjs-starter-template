import { I18nError, LogLevel } from '@lib/common';
import { UnauthorizedException } from '@nestjs/common';
import { messageEnums } from '../../common/localeKey.enum';

class InvalidCredentialsI18n extends I18nError {
    constructor(message: string, varibales: { [key: string]: string | number } = {}) {
        super(message, varibales, LogLevel.Error)
    }
}


export class InvalidCredentialsException extends UnauthorizedException {
    public I18nError: InvalidCredentialsI18n;
    constructor(private email: string) {
        super()
        this.I18nError = new InvalidCredentialsI18n(messageEnums.invalidCredential, { email });
    }

}

