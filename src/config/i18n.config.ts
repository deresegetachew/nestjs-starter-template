let i18n = require('i18n');


export const configureI18n = () => {
    i18n.configure({
        locales: ['en', 'am'],
        directory: __dirname + '/locales'
    });

}

