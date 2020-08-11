import { Exclude } from "class-transformer";


export class ErrorResponse {
    statusCode: number;
    message: string[];
}
