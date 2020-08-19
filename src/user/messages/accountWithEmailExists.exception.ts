import { I18nError, LogLevel } from '@lib/common';
import { ConflictException } from '@nestjs/common';
import { messageEnums } from 'src/common/localeKey.enum';

class AccountWithEmailExistsException extends ConflictException {
    public I18nError: AccountWithEmailExistsExceptionI18n;
    constructor(email: string) {
        super();
        this.I18nError = new AccountWithEmailExistsExceptionI18n(messageEnums.emailTaken, { email })
        // super(`An account with email ${email} already exists`);
    }
}


class AccountWithEmailExistsExceptionI18n extends I18nError {
    constructor(message: string, varibales: { [key: string]: string | number } = {}) {
        super(message, varibales, LogLevel.Warning);
    }
}

export default AccountWithEmailExistsException;