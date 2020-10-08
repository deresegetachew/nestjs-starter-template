import { InternalServerError } from '@lib/common';
import { IS_EMAIL, IS_NOT_EMPTY, IS_STRING, MIN_LENGTH, ValidationError } from "class-validator";
import { flatten } from 'lodash';
import { IsEmail, IsNotEmpty, IsString, MinLength } from './validation-errors/class-validator-errors';

export const dataValidationExceptionFactory = () => {
    return (errors: ValidationError[]) => {

        const translatedErrors = errors.map((e) => {
            const field = e.property;
            const value = e.value;
            const constraints = Object.keys(e.constraints);


            return constraints.map((c) => {

                if (c === MIN_LENGTH) {
                    const _length = parseInt(e.constraints[c].toString().replace(/\D/g, ""));

                    return new MinLength(field, _length);
                }
                else if (c === IS_NOT_EMPTY)
                    return new IsNotEmpty(field)
                else if (c === IS_EMAIL)
                    return new IsEmail(value)
                else if (c == IS_STRING)
                    return new IsString(field);
                else {
                    throw new InternalServerError(`${c} Dto exception handler not implemented, Please implement I18nError friendly Message handler for the exception`);
                    //return new InternalServerError(`${c} Dto exception handler not implemented`);
                }

            });
        });


        return flatten(translatedErrors);
    };
}


