import { I18nError, LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { localeKey } from './localekey';



class ParseUUIDErrorI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Info);
    }
}

export class ParseUUIDError extends BadRequestException {
    public I18nError: ParseUUIDErrorI18n;
    constructor(field: string) {
        super();
        this.I18nError = new ParseUUIDErrorI18n(localeKey.parseUUID, { field });
    }
}

