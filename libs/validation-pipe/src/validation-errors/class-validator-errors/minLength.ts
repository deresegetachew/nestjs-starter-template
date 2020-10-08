import { I18nError, LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { localeKey } from './localekey';

class MinLengthI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Info);
    }
}
export class MinLength extends BadRequestException {
    public I18nError: MinLengthI18n;
    constructor(field: string, length: number) {
        super();
        this.I18nError = new MinLengthI18n(localeKey.minLength, { field, length });
    }
}


