import { ErrorResponse } from "../types/ErrorResponse";
import { PostgresErrors } from "./pgErrors";
import { Request, Response } from 'express';

const PgExcecptionHandler = (exception: any) => {
    return PostgresErrors[exception.code];
    // const pgMessage = PostgresErrors[exception.code];
    // if (pgMessage) {
    //     response.status(status);
    //     response.json({
    //         statusCode: status,
    //         timestamp: new Date().toISOString(),
    //         path: request.url,
    //         message: pgMessage.getMessage(exception),
    //         ...exception.response
    //     });
    // }
    // else {
    //     response.status(status);
    //     response.json({
    //         statusCode: status,
    //         timestamp: new Date().toISOString(),
    //         path: request.url,
    //         ...exception.response
    //     });
    // }
}

export default PgExcecptionHandler;