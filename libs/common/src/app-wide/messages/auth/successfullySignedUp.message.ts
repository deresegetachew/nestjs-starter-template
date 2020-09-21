import { I18nMessage, ITransVar, LogLevel, MessageVarType } from "@lib/common";
import { authMessageLocaleKey } from "../../localekeys";

export const successfullySignedUpMessage = (): I18nMessage => {
    // key: is the key we use to fetch the data from global or data
    //type: what the key is for (global, field)
    //tkey: the key to use inside the text message to substiute the data elements we fetched using the above key and type



    const message = authMessageLocaleKey.successfullySignedUp;
    const variables: ITransVar = {
        'appConfig.APPNAME': { type: MessageVarType.global, tkey: 'appname' },
        'email': { type: MessageVarType.field, tkey: 'email' }
    };
    const logLevel: LogLevel = null;

    return { message, variables, logLevel }
}