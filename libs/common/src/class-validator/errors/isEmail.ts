import { LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { I18nError } from "../../shared-types";
import { localeKey } from '../localekeys';

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


