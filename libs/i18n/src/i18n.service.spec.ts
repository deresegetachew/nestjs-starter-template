import { createMock } from '@golevelup/nestjs-testing';
import { I18nError, I18nRequest, LogLevel } from '@lib/common';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import middleware from 'i18next-http-middleware';
import { I18nService } from './i18n.service';

//maybe a mock will return an instance of this class ?
class ErrorForTesting extends I18nError {
  constructor(message: string, variables: { [key: string]: string | number } = {}) {
    super(message, variables, LogLevel.Info);
  }
}


describe('I18nService', () => {
  let service: I18nService;
  let logger: Logger;
  let middlewareHandleSpy: jest.SpyInstance;
  let i18nextmiddlewareSpy: jest.SpyInstance;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [I18nService, Logger, ConfigService],
    }).compile();

    service = moduleRef.get<I18nService>(I18nService);
    logger = moduleRef.get<Logger>(Logger);
  });

  beforeEach(() => {
    i18nextmiddlewareSpy = jest.spyOn(middleware, 'handle');
    middlewareHandleSpy = jest.spyOn(service, 'handler');
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(middlewareHandleSpy).toBeDefined();
    expect(i18nextmiddlewareSpy).toBeDefined();
  });

  it('middleware 18next handler', () => {
    service.handler();

    expect(i18nextmiddlewareSpy).toHaveBeenCalled();
    expect(typeof i18nextmiddlewareSpy.mock.results[0].value).toBe('function')
    expect(middlewareHandleSpy).toHaveBeenCalledTimes(1);

  })

  describe('translate error', () => {
    let translateErrorSpyMock: jest.SpyInstance;
    let req: I18nRequest;
    const err = new ErrorForTesting('dummy untranslated text', {}) //createMock<ErrorForTesting>({ message: 'dummy untranslated message', variables: {} });;

    beforeEach(() => {
      translateErrorSpyMock = jest.spyOn(service, 'translateError');
      req = createMock<I18nRequest>({
        t: () => "dummy translated text"
      });
    });


    afterEach(() => {
      translateErrorSpyMock.mockRestore();
    });

    it('returns an I18nError instance', () => {

      const translatedError = service.translateError(req, err);

      expect(req.t).toHaveBeenCalledTimes(1);
      expect(req.t).toHaveBeenCalledWith(err.message, {});
      expect(req.t).toHaveReturnedWith("dummy translated text");
      expect(translatedError).toMatchObject({
        logLevel: LogLevel.Info,
        message: 'dummy translated text',
        messageForDeveloper: undefined,
        stack: expect.any(String)

      });

    });

    it('it returns the error as it is, if error is falsy', () => {

      const falsyValues = [undefined, null]
      falsyValues.forEach(element => {
        const translatedError = service.translateError(req, element);
        expect(req.t).not.toHaveBeenCalled();
        expect(translatedError).toBeFalsy();
      });
    });

  })





  // it('returns error with translated message', () => {

  // })

  // it('returns translation format error  if translation failed bc of TFunction error', () => {

  // })

});
