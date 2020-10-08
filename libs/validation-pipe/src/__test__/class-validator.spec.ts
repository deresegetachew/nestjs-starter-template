import { I18nError, LogLevel } from '@lib/common';
import { BadRequestException } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "../validation-errors/class-validator-errors";
import { localeKey } from "../validation-errors/class-validator-errors/localekey";



describe('Class validators', () => {
    describe('isEmail', () => {
        let error: IsEmail;

        beforeAll(() => {
            error = new IsEmail('dummy@email.com');
        })
        it('is defined', () => {
            expect(error).toBeDefined();
        })
        it('is an instance of BadRequestException', () => {
            expect(error).toBeInstanceOf(BadRequestException);
        })

        it('has property I18nError', () => {
            expect(error).toHaveProperty('I18nError');
            expect(error.I18nError).toBeInstanceOf(I18nError);
            expect(error.I18nError.variables).toMatchObject({ email: 'dummy@email.com' })
        });

        it('has locale key localeKey.isEmail', () => {
            expect(error.I18nError.message).toBe(localeKey.isEmail);
        })

        it('has logLevel Info', () => {
            expect(error.I18nError.logLevel).toBe(LogLevel.Info);
        })

    });

    describe('isNotEmpty', () => {
        let error: IsNotEmpty;

        beforeAll(() => {
            error = new IsNotEmpty("dummyField");
        })

        it('is defined', () => {
            expect(error).toBeDefined();
        })
        it('is an instance of BadRequestException', () => {
            expect(error).toBeInstanceOf(BadRequestException);
        })

        it('has property I18nError', () => {
            expect(error).toHaveProperty('I18nError');
            expect(error.I18nError).toBeInstanceOf(I18nError);
            expect(error.I18nError.variables).toMatchObject({ field: 'dummyField' })
        });

        it('has locale key localeKey.minLength', () => {
            expect(error.I18nError.message).toBe(localeKey.isNotEmpty);
        })

        it('has logLevel Info', () => {
            expect(error.I18nError.logLevel).toBe(LogLevel.Info);
        })
    });

    describe('isString', () => {
        let error: IsString;

        beforeAll(() => {
            error = new IsString("dummyField");
        })

        it('is defined', () => {
            expect(error).toBeDefined();
        })
        it('is an instance of BadRequestException', () => {
            expect(error).toBeInstanceOf(BadRequestException);
        })

        it('has property I18nError', () => {
            expect(error).toHaveProperty('I18nError');
            expect(error.I18nError).toBeInstanceOf(I18nError);
            expect(error.I18nError.variables).toMatchObject({ field: 'dummyField' })
        });

        it('has locale key localeKey.minLength', () => {
            expect(error.I18nError.message).toBe(localeKey.isString);
        })

        it('has logLevel Info', () => {
            expect(error.I18nError.logLevel).toBe(LogLevel.Info);
        })
    })

    describe('minLength', () => {
        let error: MinLength;

        beforeAll(() => {
            error = new MinLength("dummyField", 8);
        })

        it('is defined', () => {
            expect(error).toBeDefined();
        })
        it('is an instance of BadRequestException', () => {
            expect(error).toBeInstanceOf(BadRequestException);
        })

        it('has property I18nError', () => {
            expect(error).toHaveProperty('I18nError');
            expect(error.I18nError).toBeInstanceOf(I18nError);
            expect(error.I18nError.variables).toMatchObject({ field: 'dummyField', length: 8 })
        });

        it('has locale key localeKey.minLength', () => {
            expect(error.I18nError.message).toBe(localeKey.minLength);
        })

        it('has logLevel Info', () => {
            expect(error.I18nError.logLevel).toBe(LogLevel.Info);
        })
    })

})