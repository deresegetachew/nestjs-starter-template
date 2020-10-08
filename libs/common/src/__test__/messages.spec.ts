import { authMessageLocaleKey, commonMessagesLocaleKey } from "../app-wide/localekeys";
import { confirmationEmailSentToYourAccount, successfullySignedUpMessage, welcomeMessage } from "../app-wide/messages";
import { MessageVarType } from "../shared-types";

describe('app wide messages', () => {
    describe('common messages', () => {
        describe("welcome message", () => {
            const message = welcomeMessage();

            it('should be defined', () => {
                expect(message).toBeDefined();
                expect(typeof welcomeMessage).toBe('function');
            });

            it('returns a message of I18nMessage shape', () => {

                expect(message).toMatchObject({
                    message: commonMessagesLocaleKey.welcome,
                    variables: {
                        'appConfig.APPNAME': { type: MessageVarType.global, tkey: 'appname' },
                        'firstName': { type: MessageVarType.field, tkey: 'firstName' }
                    }, logLevel: null
                });

            })
        })
    })

    describe("auth messages", () => {
        describe("confirmationEmailSent", () => {
            const message = confirmationEmailSentToYourAccount();

            it('should be defined', () => {
                expect(message).toBeDefined();
                expect(typeof welcomeMessage).toBe('function');
            });

            it('returns a message of I18nMessage shape', () => {

                expect(message).toMatchObject({
                    message: authMessageLocaleKey.confirmationEmailSentToYourAccount,
                    variables: {
                        'email': { type: MessageVarType.field, tkey: 'email' }
                    }, logLevel: null
                });

            })
        });

        describe("successfully signed up message", () => {
            const message = successfullySignedUpMessage();

            it('should be defined', () => {
                expect(message).toBeDefined();
                expect(typeof successfullySignedUpMessage).toBe('function');
            });

            it('returns a message of I18nMessage Shape', () => {
                expect(message).toMatchObject({
                    message: authMessageLocaleKey.successfullySignedUp,
                    variables: {
                        'appConfig.APPNAME': { type: MessageVarType.global, tkey: 'appname' },
                        'email': { type: MessageVarType.field, tkey: 'email' }
                    }, logLevel: null
                });
            })
        });

    })
})