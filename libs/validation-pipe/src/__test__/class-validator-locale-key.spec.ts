import { localeKey } from '../validation-errors/class-validator-errors/localekey';

describe('classValidator error Locale keys', () => {
    it('matches enum definition snapshot', () => {
        const keys = JSON.stringify(localeKey);
        expect(keys).toMatchSnapshot();
    })
})