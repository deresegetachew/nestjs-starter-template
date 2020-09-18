import { commonErrorLocaleKey } from "../app-wide/localekeys";

describe('commonErrorLocaleKey', () => {
    it('matches enum definition snapshot', () => {
        const keys = JSON.stringify(commonErrorLocaleKey);
        expect(keys).toMatchSnapshot();
    })
})