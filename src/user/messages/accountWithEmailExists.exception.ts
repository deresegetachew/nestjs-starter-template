import { I18nError, LogLevel } from '@lib/common';
import { ConflictException } from '@nestjs/common';
import { messageEnums } from 'src/common/localeKey.enum';


class AccountWithEmailExistsExceptionI18n extends I18nError {
    constructor(message: string, variables: { [key: string]: string | number } = {}) {
        super(message, variables, LogLevel.Warning);
    }
}

class AccountWithEmailExistsException extends ConflictException {
    public I18nError: AccountWithEmailExistsExceptionI18n;
    constructor(email: string) {
        super();
        this.I18nError = new AccountWithEmailExistsExceptionI18n(messageEnums.emailTaken, { email })
    }
}




export default AccountWithEmailExistsException;