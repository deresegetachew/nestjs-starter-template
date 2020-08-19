/***
 * Postgress related Error Types and 
 * Error handler def type
 */

export interface IPgMessages {
    [k: string]: {
        getMessage: IBuildErrorMessage;
    }
};


export type IBuildErrorMessage = {
    (args: IPgError): string[];
}




export interface IPgError {
    "message": string,
    "severity": string,
    "code": string,
    "detail": string,
    "schema": string,
    "table": string,
    "query": string,
    "parameters": string[]
}

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

/**
 * 
 * @param {string} args
 * @returns {string} 
 * @description formats the unique validation message from pg in a format that suits our i18n formating.
 * it handels both cases of composite unique key validations and single unique key validations. Incase of Composite unique key we will receive msg formated as 
 * "key (fieldname,fieldname) = (value,value) already exists" which we intern transfer in to
 * '$t(glossary:wordsAndPhrases.record) with $t(gloassary:wordsAndPhrases.field,{\"count\":2}) $t(glossary:dbfileds.email),(email.com) $t(glossary:dbfileds.firstName),(name) $t(glossary:wordsAndPhrases.exists)'
 * and return it to our translating service. please refere to our locale messages to see the menaing of values like glossary:wordsAndPrhases.record
 * we are using i18next which supports namespacing and nesting for more on i18next refere [https://www.i18next.com/translation-function/nesting]
 */
const uniqueViolation: IBuildErrorMessage = (args): string[] => {
    //expected args.detail = " key (fieldname,fieldname) = (value,value) already exists";
    console.log("incoming <----", args.detail);
    let errTxt = "";
    let textinBraces = new RegExp(/(?:\(...*\))/gm);
    let braces = new RegExp(/(?:[\(]+|[\)+])/gm);
    let quotes = new RegExp(/(?:\")/gm);

    let match = args.detail.match(textinBraces);
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
        errTxt = `$t(glossary:wordsAndPhrases.record-with) ` + errTxt;
    }

    errTxt.trim();

    //errTxt = `$t(glossary:wordsAndPhrases.record) with $t(gloassary:wordsAndPhrases.field,{\"count\":2}) $t(glossary:dbfileds.email),(deresegetachew@gmail.com) $t(glossary:dbfileds.firstName),(derese) $t(glossary:wordsAndPhrases.exists)`;
    return [errTxt];
}

export const PgMessageLookUp: IPgMessages = {
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


