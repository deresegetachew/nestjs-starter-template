import { Injectable } from '@nestjs/common';
import PgError from './errors/pgError';
import { PgMessageLookUp } from './messages/pgMessagesLookup';

@Injectable()
export class PgConnectService {
    exceptionHandler(exception: any) {
        return PgMessageLookUp[exception.code];
    }

    throwPgError(exception: string[]) {
        return new PgError(exception);
    }
}
