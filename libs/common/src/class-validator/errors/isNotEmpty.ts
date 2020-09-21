import { LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { I18nError } from "../../shared-types";
import { localeKey } from '../localekeys';

class IsNotEmptyI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Info);
    }
}
export class IsNotEmpty extends BadRequestException {
    public I18nError: IsNotEmptyI18n;

    constructor(field: string) {
        super();
        this.I18nError = new IsNotEmptyI18n(localeKey.isNotEmpty, { field });
    }
}


