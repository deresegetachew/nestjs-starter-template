import { localeKey } from '../validation/pipes/localekeys';

describe('validation pipe error Locale keys', () => {
    it('matches enum definition snap shot', () => {
        const keys = JSON.stringify(localeKey);

        expect(keys).toMatchSnapshot()
    })
})