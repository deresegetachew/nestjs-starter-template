import { InternalServerError, IsEmail, IsNotEmpty, IsString, MinLength } from '@lib/common';
import { IS_EMAIL, IS_NOT_EMPTY, IS_STRING, MIN_LENGTH, ValidationError } from "class-validator";
import { flatten } from 'lodash';


export const dataValidationExceptionFactory = () => {
    return (errors: ValidationError[]) => {

        console.log("@@@@");

        const translatedErrors = errors.map((e) => {
            console.log("???", e);
            const field = e.property;
            const value = e.value;
            const constraints = Object.keys(e.constraints);

            return constraints.map((c) => {
                if (c === MIN_LENGTH)
                    return new MinLength(field, 8);
                else if (c === IS_NOT_EMPTY)
                    return new IsNotEmpty(field)
                else if (c === IS_EMAIL)
                    return new IsEmail(value)
                else if (c == IS_STRING)
                    return new IsString(field);
                else {
                    throw new InternalServerError(`${c} Dto exception handler not implemented`);
                    //return new InternalServerError(`${c} Dto exception handler not implemented`);
                }

            });
        });


        return flatten(translatedErrors);
    };
}


