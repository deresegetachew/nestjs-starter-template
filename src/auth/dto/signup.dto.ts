import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';
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
    @MinLength(8)
    @MaxLength(20)
    password: string;

    @IsNotEmpty()
    @Match("password")
    confirmPassword: string;
}


export default SignUpDto;