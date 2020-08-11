import { HttpException, HttpStatus } from '@nestjs/common';

class AccountWithEmailExistsException extends HttpException {
    constructor(email: string) {
        super(`An account with email ${email} already exists`, HttpStatus.CONFLICT);
    }
}


export default AccountWithEmailExistsException;