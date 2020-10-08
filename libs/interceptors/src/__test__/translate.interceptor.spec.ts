//what do i want to test ?

import { createMock } from "@golevelup/nestjs-testing";
import { LogLevel } from "@lib/common";
import { I18nService } from "@lib/i18n";
import { CallHandler, ExecutionContext, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import i18next from "i18next";
import { of } from "rxjs";
import { messageEnums } from "src/common/localeKey.enum";
import { TranslateInterceptor } from "../translation/translate.Interceptor";
//i want to test it only handel's non error cases
//if <400 ...
//if >= 400 it calls next.handle() 1 times

//formatResponse is called.
//response obj has the signiture of  statusCode , data, message


describe('TranslateInterceptor', () => {
    let interceptor: TranslateInterceptor<any>;
    let i18nService: I18nService;
    let configService: ConfigService;
    let logger: Logger;
    let reflector: Reflector
    let reflectorGetSpyMock: jest.SpyInstance;
    let i18nServiceTranslateSpy: jest.SpyInstance;
    const message = messageEnums.test;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                TranslateInterceptor,
                I18nService,
                ConfigService,
                Logger,
                {
                    provide: Reflector,
                    useValue: createMock<Reflector>()
                }
            ]
        }).compile();

        interceptor = moduleRef.get(TranslateInterceptor);
        i18nService = moduleRef.get<I18nService>(I18nService);
        configService = moduleRef.get<ConfigService>(ConfigService);
        logger = moduleRef.get<Logger>(Logger);
        reflector = moduleRef.get<Reflector>(Reflector);


        //     i18next
        //         .use(Backend as any)
        //         .init({
        //             preload: ['en', "am"],
        //             ns: ["common", "glossary", "dto"],
        //             fallbackLng: 'en',
        //             fallbackNS: ["common", "glossary", "dto"],
        //             detection: {
        //                 lookupQuerystring: 'lang',
        //                 lookupHeader: 'accept-language',
        //             },
        //             backend: {
        //                 loadPath: path.resolve(__dirname, '..', '..', 'i18n/locale/{{lng}}/{{ns}}.json')
        //             },
        //             initImmediate: true,
        //             debug: false // this.configService.get<string>('NODE_ENV') == 'development' ? true : false
        //         }, (err, t) => {
        //             console.log(i18next.t);
        //             if (err)
        //                 this.logger.error(`translation error: ${err}`);

        //             done();
        //         });
    });


    beforeEach(() => {
        reflectorGetSpyMock = jest.spyOn(reflector, 'get');
        i18nServiceTranslateSpy = jest.spyOn(i18nService, 'translateMessage');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should return an object formatted {statusCode,data,message} for < 400 status codes', (done) => {
        const context = createMock<ExecutionContext>();
        const next = createMock<CallHandler>();

        context.getType.mockReturnValue('http');
        // context.getHandler.mockReturnValue(() => { });
        context.switchToHttp().getResponse.mockReturnValue({ statusCode: 200 });
        context.switchToHttp().getRequest.mockReturnValue({ t: i18next.t.bind(i18next) });


        //initialize i18ncode here


        // what is next.handle().pipe(map()) //pipe , map

        i18nServiceTranslateSpy.mockImplementationOnce(() => 'dummy translation');
        next.handle.mockImplementation(() => of({}))
        reflectorGetSpyMock.mockImplementation(() => [{ message, variables: {}, logLevel: LogLevel.Info }]);

        interceptor.intercept(context, next).subscribe({
            next: (value) => {

                expect(value).toHaveProperty("statusCode");
                expect(value).toHaveProperty("data");
                expect(value).toHaveProperty("message");
                // expect(value.message).toEqual(expect.arrayContaining(['This is a test message']))
                expect(i18nServiceTranslateSpy).toHaveBeenCalled();
                //expect(i18nServiceTranslateSpy.mock.calls[0][1].toEqual(message));
            },
            complete: () => {
                done();
            },
            error: (error) => {
                console.error(error);
                throw error;
            }
        })
    });


    it('should return an observable for status code >= 400', (done) => {
        const context = createMock<ExecutionContext>();
        const next = createMock<CallHandler>();

        context.getType.mockReturnValue('http');
        // context.getHandler.mockReturnValue(() => { });
        context.switchToHttp().getResponse.mockReturnValue({ statusCode: 400 });
        next.handle.mockImplementation(() => of({}));

        interceptor.intercept(context, next).subscribe(
            {
                next: async (value) => {
                    await expect(value).resolves.toBe({})
                    expect(next.handle).toHaveBeenCalled();
                },
                complete: () => {
                    done();
                },
                error: (error) => {
                    console.error(error);
                    throw error;
                }
            }
        )
    })

});