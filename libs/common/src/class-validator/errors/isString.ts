import { LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { I18nError } from "../../shared-types";
import { localeKey } from '../localekeys';

export class IsString extends BadRequestException {
    public I18nError: IsStringI18n;

    constructor(field: string) {
        super();
        this.I18nError = new IsStringI18n(localeKey.isString, { field });
    }
}


class IsStringI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Error);
    }
}