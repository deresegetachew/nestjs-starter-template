import { I18nMessage, ITransVar, LogLevel, MessageVarType } from "@lib/common";
import { messageEnums } from "../../common/localeKey.enum";


export const welcomeMessage = (): I18nMessage => {


    let message: string;
    let variables: ITransVar;
    // key: is the key we use to fetch the data from global or data
    //type: what the key is for (global, field)
    //tkey: the key to use inside the text message to substiute the data elements we fetched using the above key and type


    let transVar: { [key: string]: { type: string, tkey: string } };
    let logLevel: LogLevel;


    message = messageEnums.welcome;
    variables = {
        'appConfig.APPNAME': { type: MessageVarType.global, tkey: 'appname' },
        'firstName': { type: MessageVarType.field, tkey: 'firstName' }
    };

    logLevel = null;

    return {
        message, variables, logLevel
    }

}
