import { BadRequestException } from "@nestjs/common";
import { I18nError, LogLevel } from "../shared-types";
import { ParseUUIDError } from "../validation";
import { localeKey } from "../validation/pipes/localekeys";

describe('validation pipes', () => {
    describe('ParseUUID', () => {
        let error: ParseUUIDError;

        beforeAll(() => {
            error = new ParseUUIDError("dummyField");
        });

        it('should be defined', () => {
            expect(error).toBeDefined();
        })

        it('is an instance of BadRequestException', () => {
            expect(error).toBeInstanceOf(BadRequestException)
        })

        it('has property I18nError', () => {
            expect(error).toHaveProperty('I18nError');
            expect(error.I18nError).toBeInstanceOf(I18nError);
            expect(error.I18nError.variables).toMatchObject({ field: 'dummyField' })
        })

        it('has localeKey localKey.parseUUID', () => {
            expect(error.I18nError.message).toBe(localeKey.parseUUID)
        })

        it('has logLevel Info', () => {
            expect(error.I18nError.logLevel).toBe(LogLevel.Info);
        })
    })
})