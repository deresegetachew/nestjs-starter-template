import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Match } from '../../common/match.validation';


class SignUpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @Match("password")
    confirmPassword: string;
}


export default SignUpDto;