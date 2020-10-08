import { BadRequestException } from "@nestjs/common";
import { I18nError, LogLevel } from "../../../shared-types";
import { authErrorLocaleKey } from "../../localekeys/auth";


class PasswordLengthToShortI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Info);
    }
}

export class PasswordLengthToShort extends BadRequestException {
    public I18nError: PasswordLengthToShortI18n;

    constructor(private length: number) {
        super();
        this.I18nError = new PasswordLengthToShortI18n(authErrorLocaleKey.passwordLengthToShort, { length: this.length });
    }
}

