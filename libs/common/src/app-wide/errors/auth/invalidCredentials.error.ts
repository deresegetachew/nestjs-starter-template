import { UnauthorizedException } from '@nestjs/common';
import { I18nError, LogLevel } from '../../../shared-types';
import { authErrorLocaleKey } from '../../localekeys/auth';

class InvalidCredentialsI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Error)
    }
}



export class InvalidCredentials extends UnauthorizedException {
    public I18nError: InvalidCredentialsI18n;
    constructor(private email: string) {
        super()
        this.I18nError = new InvalidCredentialsI18n(authErrorLocaleKey.invalidCredential, { email: this.email });
    }

}

