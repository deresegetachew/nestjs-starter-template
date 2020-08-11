import { IPgMessages, IBuildErrorMessage, Locale } from '../types/IPgMessages';
import { ConflictException } from '@nestjs/common';
import { LogLevel } from 'src/common/logLevel';


/**
 * 
 * @param locale Locale enums and if nothing is passed defaults to english 
 */
const divissionByZero: IBuildErrorMessage = () => {
    return ["Divission by zero is  illegal"];
}

const invalidDateFormat: IBuildErrorMessage = () => {
    return [""];
}


const usePgMessage: IBuildErrorMessage = (args) => {
    return [args.detail];
}

const uniqueViolation: IBuildErrorMessage = (args): string[] => {
    //expected args.detail = " key (fieldname,fieldname) = (value,value) already exists";
    let errTxt = "";
    let textinBraces = new RegExp(/(?:\(...*\))/gm);
    let braces = new RegExp(/(?:[\(]+|[\)+])/gm);
    let quotes = new RegExp(/(?:\")/gm);

    let match = args.detail.match(textinBraces);
    console.log("???? I AM HERE", args.detail);
    if (match.length > 0) {

        let txt: string = match[0];
        txt = txt.replace(braces, '');

        let valuesInBraces = txt.split("=");

        // composite unique keys
        if (valuesInBraces.length > 0) {
            //key value pairs (keys) = (values). 
            const keys: string = txt.split("=")[0];
            const values: string = txt.split("=")[1];

            const keyArray = keys.replace(quotes, '').split(",");
            const valuesArray = values.replace(quotes, '').split(",");

            errTxt = `$t(glossary:wordsAndPhrases.field,{\"count\" \: ${keyArray.length}}) `;
            keyArray.map((k, index) => {
                errTxt = errTxt.concat(`($t(glossary:field.${k.trim()}): ${valuesArray[index].trim()}), `)
            });
        }
        else if (valuesInBraces.length == 0) {
            // only keys  (keys) = txt.
            const keys: string = txt.split("=")[0];
            const keyArray = keys.split(",");

            errTxt = `$t(glossary:wordsAndPhrases.field {\"count\" \: ${keyArray.length}}) `;
            keyArray.map((k, index) => {
                errTxt = errTxt.concat(`$t(glossary:field.${k.trim()})`)
            });
        }

        errTxt = errTxt.concat(`$t(glossary:wordsAndPhrases.exists)`);
        errTxt = `$t(glossary:wordsAndPhrases.record) with ` + errTxt;
    }



    errTxt.trim();
    console.log("-->", errTxt);

    //errTxt = `$t(glossary:wordsAndPhrases.record) with $t(gloassary:wordsAndPhrases.field,{\"count\":2}) $t(glossary:dbfileds.email),(deresegetachew@gmail.com) $t(glossary:dbfileds.firstName),(derese) $t(glossary:wordsAndPhrases.exists)`;
    return [errTxt]; // format the text here
}

export const PostgresErrors: IPgMessages = {
    '22012': {
        getMessage: divissionByZero
    },
    '22007': {
        getMessage: usePgMessage
    },
    '22004': {
        getMessage: usePgMessage
    },
    '22003': {
        getMessage: usePgMessage
    },
    '23502': {
        getMessage: usePgMessage
    },
    '23503': {
        getMessage: usePgMessage
    },
    '23505': {
        getMessage: uniqueViolation
    }
}


