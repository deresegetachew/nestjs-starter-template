import { I18nError, LogLevel } from "@lib/common";
import { BadRequestException } from "@nestjs/common";
import { messageEnums } from "../../common/localeKey.enum";

export class PasswordLengthToShort extends BadRequestException {
    public I18nError: PasswordLengthToShortI18n;

    constructor() {
        super();
        this.I18nError = new PasswordLengthToShortI18n(messageEnums.passwordLengthToShort, { length: 8 });
    }
}

class PasswordLengthToShortI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Error);
    }
}