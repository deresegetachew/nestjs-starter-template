import { localeKey } from '../class-validator/localekeys';

describe('classValidator error Locale keys', () => {
    it('matches enum definition snapshopt', () => {
        const keys = JSON.stringify(localeKey);
        expect(keys).toMatchSnapshot();
    })
})