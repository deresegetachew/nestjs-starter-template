import { HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { I18nError } from 'src/i18n/i18n-error';
import { LogLevel } from 'src/common/logLevel';
import messageEnums from '../message.enum';


class InvalidCredentials extends UnauthorizedException {
    public i18nError: InvalidCredentialsI18n;
    constructor(private email: string) {
        super()
        this.i18nError = new InvalidCredentialsI18n(messageEnums.invalidCredential, { email });
    }

}

class InvalidCredentialsI18n extends I18nError {
    constructor(message: string, varibales: { [key: string]: string | number } = {}) {
        super(message, varibales, LogLevel.Error);
    }
}



export default InvalidCredentials;