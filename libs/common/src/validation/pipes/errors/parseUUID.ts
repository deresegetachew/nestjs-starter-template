import { LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { I18nError } from "../../../shared-types";
import { localeKey } from '../localekeys';

export class parseUUIDError extends BadRequestException {
    public I18nError: parseUUIDErrorI18n;
    constructor(field: string) {
        super();
        this.I18nError = new parseUUIDErrorI18n(localeKey.parseUUID, { field });
    }
}


class parseUUIDErrorI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Info);
    }
}