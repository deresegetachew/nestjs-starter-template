import { parseUUIDError } from "@lib/common";

export const parseUUIDExceptionFactory = (field: string) => {
    return (errors: string) => {
        return new parseUUIDError(field);
    }
}