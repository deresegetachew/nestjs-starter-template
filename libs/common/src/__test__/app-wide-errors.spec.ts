import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { I18nError, LogLevel } from "..";
import { InternalServerError, NotFoundError } from "../app-wide/errors";
import { commonErrorLocaleKey } from "../app-wide/localekeys";


describe('app wide errors', () => {
    describe('internal server error', () => {
        let error: InternalServerError;
        beforeAll(() => {
            error = new InternalServerError();
        })

        it('should be defined', () => {
            expect(error).toBeDefined();
        })
        it('is an instance of InternalServerErrorException', () => {
            expect(error).toBeInstanceOf(InternalServerErrorException)
        })

        it('has property I18nError', () => {
            expect(error).toHaveProperty('I18nError');
            expect(error.I18nError).toBeInstanceOf(I18nError);
        });

        it('has localeKey commonErrorLocaleKey.internalServerError', () => {
            expect(error.I18nError.message).toBe(commonErrorLocaleKey.internalServerError)
        });

        it('has logLevel Error', () => {
            expect(error.I18nError.logLevel).toBe(LogLevel.Error);
        })
    });


    describe('not found error', () => {
        let error: NotFoundError;

        beforeAll(() => {
            error = new NotFoundError({
                entity: '', field: '', value: ''
            });
        })
        it('should be defined', () => {
            expect(error).toBeDefined();
        })

        it('is an instance of NotFoundException', () => {
            expect(error).toBeInstanceOf(NotFoundException);
        })

        it('has property I18nError', () => {
            expect(error).toHaveProperty('I18nError');
            expect(error.I18nError).toBeInstanceOf(I18nError);
            expect(error.I18nError.variables).toMatchObject({ entity: '', field: '', value: '' })
        });

        it('has localeKey commonErrorLocaleKey.notFound', () => {
            expect(error.I18nError.message).toBe(commonErrorLocaleKey.notFoundError)
        })

        it('has logLevel Error', () => {
            expect(error.I18nError.logLevel).toBe(LogLevel.Error);
        })
    })
})
