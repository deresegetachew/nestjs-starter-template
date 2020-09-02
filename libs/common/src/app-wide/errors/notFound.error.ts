import { NotFoundException } from "@nestjs/common";
import { I18nError, LogLevel } from '../../shared-types';
import { commonErrorLocaleKey } from '../localekeys';

interface INotFoundParam {
    entity: string
    field: string
    value: string
}

class NotFoundErrorI18n extends I18nError {
    constructor(message: string, varibales: { [key: string]: string | number } = {}, messageForDeveloper?: string) {
        super(message, varibales, LogLevel.Error, messageForDeveloper);
    }
}

export class NotFoundError extends NotFoundException {
    public I18nError: NotFoundErrorI18n;
    constructor(param: INotFoundParam) {
        super()
        this.I18nError = new NotFoundErrorI18n(commonErrorLocaleKey.notFoundError, { ...param });
    }
}
