import { PgConnectService } from "@db/pg-connect";
import { authErrorLocaleKey, commonErrorLocaleKey, InternalServerError, InvalidCredentials, NotFoundError, PasswordLengthToShort } from "@lib/common";
import { I18nService } from "@lib/i18n";
import { ArgumentsHost, BadGatewayException, BadRequestException, ConflictException, ForbiddenException, GatewayTimeoutException, GoneException, InternalServerErrorException, Logger, MethodNotAllowedException, NotAcceptableException, NotFoundException, NotImplementedException, PayloadTooLargeException, RequestTimeoutException, ServiceUnavailableException, UnauthorizedException, UnprocessableEntityException, UnsupportedMediaTypeException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { AppExceptionFilter } from "../exceptionFilter";

describe('App Exception Filter', () => {
    let i18nService: I18nService;
    let logger: Logger;
    let pgConnectService: PgConnectService;
    let i18nServiceTranslateErrorSpy: jest.SpyInstance;
    let i18nServiceTranslateHttExceptionSpy: jest.SpyInstance;
    let loggerErrorSpy: jest.SpyInstance;
    let loggerWaningSpy: jest.SpyInstance;
    let loggerLogSpy: jest.SpyInstance;
    let appExceptionFilterLogSpy: jest.SpyInstance;

    let appExceptionFilter: AppExceptionFilter;


    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockT: jest.Mock;
    let mockGetResponse: jest.Mock;
    let mockGetRequest: jest.Mock;
    let mockHttpArgumentsHost: jest.Mock;
    let mockArgumentsHost: ArgumentsHost;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                Logger,
                I18nService,
                PgConnectService,
                ConfigService
            ]
        }).compile();


        logger = moduleRef.get<Logger>(Logger);
        i18nService = moduleRef.get<I18nService>(I18nService);
        pgConnectService = moduleRef.get<PgConnectService>(PgConnectService);

        appExceptionFilter = new AppExceptionFilter(logger, i18nService, pgConnectService);

    });

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockImplementation(() => ({ json: mockJson }));
        mockT = jest.fn().mockImplementation(() => "translated dummy message");
        mockGetResponse = jest.fn().mockImplementation(() => ({
            status: mockStatus
        }));
        mockGetRequest = jest.fn().mockImplementation(() => ({
            t: mockT
        }));
        mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
            getResponse: mockGetResponse,
            getRequest: mockGetRequest
        }));

        mockArgumentsHost = {
            switchToHttp: mockHttpArgumentsHost,
            getArgByIndex: jest.fn(),
            getArgs: jest.fn(),
            getType: jest.fn(),
            switchToRpc: jest.fn(),
            switchToWs: jest.fn()
        };

        i18nServiceTranslateErrorSpy = jest.spyOn(i18nService, 'translateError');
        i18nServiceTranslateHttExceptionSpy = jest.spyOn(i18nService, 'translateHttpException')
        appExceptionFilterLogSpy = jest.spyOn(AppExceptionFilter.prototype as any, 'log');
        loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => { });
        loggerWaningSpy = jest.spyOn(logger, 'warn').mockImplementation(() => { });
        loggerLogSpy = jest.spyOn(logger, 'log').mockImplementation(() => { });
    })

    afterEach(() => {
        jest.restoreAllMocks();
    })


    it('should be defined', () => {
        expect(appExceptionFilter).toBeDefined();
    })


    describe('Localized Errors', () => {

        it('Catches Internal Sever error', async () => {

            const exception = new InternalServerError("dummy error");
            i18nServiceTranslateErrorSpy.mockImplementationOnce(() => {
                exception.message = "translated dummy message";
                return exception;
            });

            appExceptionFilter.catch(exception, mockArgumentsHost);


            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(appExceptionFilterLogSpy).toHaveBeenCalled();
            expect(loggerErrorSpy.mock.calls[0][0]).toMatch(/dummy error/);
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(500);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 500,
                data: null,
                message: ['translated dummy message']
            });

        })

        it('returns 401 for InvalidCredentials', () => {
            const exception = new InvalidCredentials("dummy@email.com");

            appExceptionFilter.catch(exception, mockArgumentsHost);

            expect(exception).toBeDefined();
            expect(exception).toBeInstanceOf(UnauthorizedException);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateErrorSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenCalledWith(authErrorLocaleKey.invalidCredential, { "email": "dummy@email.com" })
            expect(appExceptionFilterLogSpy).toHaveBeenCalled();
            expect(mockStatus).toBeCalledWith(401);
            expect(mockJson).toBeCalledWith({
                statusCode: 401,
                data: null,
                message: ["translated dummy message"]
            });
        });


        it('returns 404 for NotFoundError', () => {
            const exception = new NotFoundError({ entity: 'dummyentity', field: 'dummyfield', value: 'dummyvalue' })

            appExceptionFilter.catch(exception, mockArgumentsHost);

            expect(exception).toBeDefined();
            expect(exception).toBeInstanceOf(NotFoundException);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateErrorSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenCalledWith(commonErrorLocaleKey.notFoundError, { entity: 'dummyentity', field: 'dummyfield', value: 'dummyvalue' })
            expect(appExceptionFilterLogSpy).toHaveBeenCalled();
            expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
            expect(mockStatus).toBeCalledWith(404);
            expect(mockJson).toBeCalledWith({
                statusCode: 404,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 400 for PasswordLengthToShortError', () => {
            const exception = new PasswordLengthToShort(8);

            appExceptionFilter.catch(exception, mockArgumentsHost);

            expect(exception).toBeDefined();
            expect(exception).toBeInstanceOf(BadRequestException);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateErrorSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenCalledWith(authErrorLocaleKey.passwordLengthToShort, { length: 8 })
            expect(appExceptionFilterLogSpy).toHaveBeenCalled();
            expect(loggerLogSpy).toHaveBeenCalledTimes(1);
            expect(mockStatus).toBeCalledWith(400);
            expect(mockJson).toBeCalledWith({
                statusCode: 400,
                data: null,
                message: ["translated dummy message"]
            });
        })

    })


    describe('errors that are instance of HttpExceptions', () => {

        it('returns 400 for BadRequestException', () => {
            const exception = new BadRequestException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.400')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(400);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 400,
                data: null,
                message: ["translated dummy message"]
            });
        })


        it('returns 401 for UnauthorizedException', () => {
            const exception = new UnauthorizedException();

            appExceptionFilter.catch(exception, mockArgumentsHost);


            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.401')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(401);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 401,
                data: null,
                message: ["translated dummy message"]
            });
        });

        it('returns 403 ForbiddenException', () => {

            const exception = new ForbiddenException();

            appExceptionFilter.catch(exception, mockArgumentsHost);


            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.403')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(403);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 403,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 404 for NotFoundException', () => {
            const exception = new NotFoundException();

            appExceptionFilter.catch(exception, mockArgumentsHost);


            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.404')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(404);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 404,
                data: null,
                message: ["translated dummy message"]
            });
        })





        it('returns 405 for MethodNotAllowedException', () => {

            const exception = new MethodNotAllowedException();

            appExceptionFilter.catch(exception, mockArgumentsHost);


            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.405')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(405);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 405,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 406 for NotAcceptableException', () => {
            const exception = new NotAcceptableException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.406')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(406);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 406,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 408 for RequestTimeoutException', () => {
            const exception = new RequestTimeoutException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.408')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(408);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 408,
                data: null,
                message: ["translated dummy message"]
            });
        })


        it('returns 409 for ConflictException', () => {
            const exception = new ConflictException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.409')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(409);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 409,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 410 for GoneException', () => {
            const exception = new GoneException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.410')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(410);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 410,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 413 for PayloadTooLargeException', () => {
            const exception = new PayloadTooLargeException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.413')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(413);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 413,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 415 for UnsupportedMediaTypeException', () => {
            const exception = new UnsupportedMediaTypeException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.415')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(415);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 415,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 422 for UnprocessableEntityException', () => {
            const exception = new UnprocessableEntityException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.422')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(422);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 422,
                data: null,
                message: ["translated dummy message"]
            });
        })


        it('returns 500 from InternalServerErrorException', () => {
            const exception = new InternalServerErrorException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.500')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(500);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 500,
                data: null,
                message: ["translated dummy message"]
            });
        });

        it('returns 501 for NotImplementedException', () => {
            const exception = new NotImplementedException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.501')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(501);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 501,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 502 for BadGatewayException', () => {
            const exception = new BadGatewayException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.502')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(502);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 502,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 503 for ServiceUnavailableException', () => {
            const exception = new ServiceUnavailableException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.503')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(503);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 503,
                data: null,
                message: ["translated dummy message"]
            });
        })

        it('returns 504 for GatewayTimeoutException', () => {
            const exception = new GatewayTimeoutException();

            appExceptionFilter.catch(exception, mockArgumentsHost);
            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(i18nServiceTranslateHttExceptionSpy).toHaveBeenCalled()
            expect(mockT).toHaveBeenLastCalledWith('common:httpExceptions.504')
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(504);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 504,
                data: null,
                message: ["translated dummy message"]
            })

        })

    })

    describe('database exceptions', () => {

    })


    describe('errors that are not localized or instance of I18nError', () => {
        it('logs error to developer when error is not translated', () => {
            // loggerErrorSpy.mockImplementationOnce(() => { })

            const exception = new Error("Untranslated error");

            appExceptionFilter.catch(exception, mockArgumentsHost);


            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(appExceptionFilterLogSpy).toHaveBeenCalled();
            expect(loggerErrorSpy.mock.calls[0][0]).toMatch(/Untranslated Error: /);
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(500);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 500,
                data: null,
                message: ['Untranslated error']

            });
        })
    })


})