// import { PgErrorLookup } from "./pgErrorLookup";

// const PgExcecptionHandler = (exception: any) => {
//     return PgErrorLookup[exception.code];
//     // const pgMessage = PostgresErrors[exception.code];
//     // if (pgMessage) {
//     //     response.status(status);
//     //     response.json({
//     //         statusCode: status,
//     //         timestamp: new Date().toISOString(),
//     //         path: request.url,
//     //         message: pgMessage.getMessage(exception),
//     //         ...exception.response
//     //     });
//     // }
//     // else {
//     //     response.status(status);
//     //     response.json({
//     //         statusCode: status,
//     //         timestamp: new Date().toISOString(),
//     //         path: request.url,
//     //         ...exception.response
//     //     });
//     // }
// }

// export default PgExcecptionHandler;