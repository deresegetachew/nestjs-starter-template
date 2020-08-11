import { IsEmail, IsNotEmpty, IsString } from "class-validator";

class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}


export default LoginDto;