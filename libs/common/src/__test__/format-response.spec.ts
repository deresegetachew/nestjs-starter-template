import { formatResponse } from "../format-response"

describe('formatResponse', () => {
    it('returns an object with signature {statusCode,data,message}', () => {
        expect(formatResponse(200, [], {})).toMatchObject({ statusCode: 200, message: [], data: {} })
    })
})