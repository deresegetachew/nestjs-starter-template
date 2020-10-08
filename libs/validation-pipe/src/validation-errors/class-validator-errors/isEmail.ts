import { I18nError, LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { localeKey } from './localekey';


class IsEmailI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Info);
    }
}

export class IsEmail extends BadRequestException {
    public I18nError: IsEmailI18n;
    constructor(email: string) {
        super();
        this.I18nError = new IsEmailI18n(localeKey.isEmail, { email });
    }
}


