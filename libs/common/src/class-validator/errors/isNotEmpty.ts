import { LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { localeKey } from '../../app-wide/localekeys';
import { I18nError } from "../../shared-types";

export class IsNotEmpty extends BadRequestException {
    public I18nError: IsNotEmptyI18n;

    constructor(field: string) {
        super();
        this.I18nError = new IsNotEmptyI18n(localeKey.isNotEmpty, { field });
    }
}


class IsNotEmptyI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Error);
    }
}