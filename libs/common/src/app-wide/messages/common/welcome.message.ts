import { I18nMessage, ITransVar, LogLevel, MessageVarType } from "@lib/common";
import { commonMessagesLocaleKey } from "../../localekeys";


export const welcomeMessage = (): I18nMessage => {



    // key: is the key we use to fetch the data from global or data
    //type: what the key is for (global, field)
    //tkey: the key to use inside the text message to substiute the data elements we fetched using the above key and type


    let transVar: { [key: string]: { type: string, tkey: string } };

    const message = commonMessagesLocaleKey.welcome;
    const variables: ITransVar = {
        'appConfig.APPNAME': { type: MessageVarType.global, tkey: 'appname' },
        'firstName': { type: MessageVarType.field, tkey: 'firstName' }
    };

    const logLevel: LogLevel = null;

    return {
        message, variables, logLevel
    }

}
