import { PgConnectService } from "@db/pg-connect";
import { InternalServerError, InvalidCredentials } from "@lib/common";
import { ArgumentsHost, Logger, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { I18nService } from "src/i18n/i18n.service";
import { AppExceptionFilter } from "../exceptionFilter";

describe('App Exception Filter', () => {
    let i18nService: I18nService;
    let logger: Logger;
    let pgConnectService: PgConnectService;
    let i18nServiceTranslateErrorSpy: jest.SpyInstance;
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


    describe('Internal Server Error', () => {
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
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(500);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 500,
                data: null,
                message: ['translated dummy message']
            });

        })
    })

    describe('errors that are not instance of I18nError', () => {
        it('logs error to developer when error is not translated', () => {
            loggerErrorSpy.mockImplementationOnce(() => { })

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

    describe('errors that are instance of HttpExceptions', () => {

        it('returns 401 for UnauthorizedException', () => {


            const exception = new UnauthorizedException();

            appExceptionFilter.catch(exception, mockArgumentsHost);


            expect(mockHttpArgumentsHost).toBeCalledTimes(1);
            expect(mockHttpArgumentsHost).toBeCalledWith();
            expect(mockGetResponse).toBeCalledTimes(1);
            expect(mockGetResponse).toBeCalledWith();
            expect(appExceptionFilterLogSpy).toHaveBeenCalled();
            expect(mockStatus).toBeCalledTimes(1);
            expect(mockStatus).toBeCalledWith(401);
            expect(mockJson).toBeCalledTimes(1);
            expect(mockJson).toBeCalledWith({
                statusCode: 401,
                data: null,
                message: ['Unauthorized']
            });
        });

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
            expect(mockT).toHaveBeenCalledWith('common:error.invalid-credentials', { "email": "dummy@email.com" })
            expect(appExceptionFilterLogSpy).toHaveBeenCalled();
            expect(mockStatus).toBeCalledWith(401);
            expect(mockJson).toBeCalledWith({
                statusCode: 401,
                data: null,
                message: ["translated dummy message"]
            });
        });


        it('returns 404 for NotFoundException', () => {
            throw new NotImplementedException();
        })

        it('returns 403 ForbiddenException', () => {
            throw new NotImplementedException();
        })


        it('returns 405 for MethodNotAllowedException', () => {
            throw new NotImplementedException();
        })

        it('returns  406 for NotAcceptableException', () => {
            throw new NotImplementedException();
        })

        it('returns  408 for RequestTimeoutException', () => {
            throw new NotImplementedException();
        })


        it('returns 409 for ConflictException', () => {
            throw new NotImplementedException();
        })

        it('returns 410 for GoneException', () => {
            throw new NotImplementedException();
        })

        it('returns 413 for PayloadTooLargeException', () => {
            throw new NotImplementedException();
        })

        it('returns  415 for UnsupportedMediaTypeException', () => {
            throw new NotImplementedException();
        })

        it('returns 422 for UnprocessableEntityException', () => {
            throw new NotImplementedException();
        })

        it('returns statusCode 400 for HttpException BadRequestException', () => {
            throw new NotImplementedException();
        })

        it('returns statusCode 500 from InternalServerErrorException', () => {
            throw new NotImplementedException();
        })

        it('returns 501 for NotImplementedException', () => {
            throw new NotImplementedException();
        })

        it('returns 502 for BadGatewayException', () => {
            throw new NotImplementedException();
        })

        it('returns 503 for ServiceUnavailableException', () => {
            throw new NotImplementedException();
        })

        it('returns 504 for GatewayTimeoutException', () => {
            throw new NotImplementedException();
        })

    })

    describe('database exceptions', () => {

    })



})