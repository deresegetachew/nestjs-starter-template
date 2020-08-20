import { IAppResponse } from "@lib/common";

export const formatResponse = (statusCode, message: string[], data?: any): IAppResponse<any> => {
    return { statusCode: statusCode, data: data, message: message || [] };
}