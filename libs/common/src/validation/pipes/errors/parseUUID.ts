import { LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { I18nError } from "../../../shared-types";
import { localeKey } from '../localekeys';



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

