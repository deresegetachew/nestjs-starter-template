import { ParseUUIDError } from './validation-errors/builtin-pipe-errors';

/**
 * Not our typical service 
 * we are using it to define static methods
 * since it will be accessed inside @paramDecotrator
 * if we use DI it will be to early to be instantiated by the DI engine
 */
export class ValidationPipeService {
    static parseUUIDPipeErrorFactory(field: string) {
        return (errors: string) => {
            return new ParseUUIDError(field);
        }
    }
}
