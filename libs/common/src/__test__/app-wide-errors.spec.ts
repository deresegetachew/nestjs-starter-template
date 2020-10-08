import { BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { I18nError, LogLevel } from "..";
import { InternalServerError, InvalidCredentials, NotFoundError, PasswordLengthToShort } from "../app-wide/errors";
import { authErrorLocaleKey, commonErrorLocaleKey } from "../app-wide/localekeys";


describe('app wide errors', () => {

    describe("common errors", () => {

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
    });

    describe("auth errors", () => {
        describe('invalidCredentials error', () => {

            let error: InvalidCredentials;

            beforeAll(() => {
                error = new InvalidCredentials("dummy@email.com");
            })
            it('should be defined', () => {
                expect(error).toBeDefined();
            });

            it('is an instance of UnauthroizedException', () => {
                expect(error).toBeInstanceOf(UnauthorizedException);
            })

            it('has property I18nError', () => {
                expect(error).toHaveProperty('I18nError')
                expect(error.I18nError).toBeInstanceOf(I18nError);
                expect(error.I18nError.variables).toMatchObject({ email: 'dummy@email.com' })
            })

            it('has localeKey authErrorLocaleKey.invalidCredential', () => {
                expect(error.I18nError.message).toBe(authErrorLocaleKey.invalidCredential)
            })
            it('has LogLevel Error', () => {
                expect(error.I18nError.logLevel).toBe(LogLevel.Error);
            })
        })


        describe('passwordLengthToShort error', () => {
            let error: PasswordLengthToShort;

            beforeAll(() => {
                error = new PasswordLengthToShort(8);
            })
            it('should be defined', () => {
                expect(error).toBeDefined();
            });

            it('is an instance of BadRequestException', () => {
                expect(error).toBeInstanceOf(BadRequestException);
            })

            it('has property I18nError', () => {
                expect(error).toHaveProperty('I18nError')
                expect(error.I18nError).toBeInstanceOf(I18nError);
                expect(error.I18nError.variables).toMatchObject({ length: 8 })
            })

            it('has localeKey authErrorLocaleKey.passwordLengthToShort', () => {
                expect(error.I18nError.message).toBe(authErrorLocaleKey.passwordLengthToShort)
            })
            it('has LogLevel Info', () => {
                expect(error.I18nError.logLevel).toBe(LogLevel.Info);
            })
        })
    });
})
