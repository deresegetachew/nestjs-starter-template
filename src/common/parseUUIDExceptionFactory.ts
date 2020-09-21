import { ParseUUIDError } from "@lib/common";

export const parseUUIDExceptionFactory = (field: string) => {
    return (errors: string) => {
        return new ParseUUIDError(field);
    }
}