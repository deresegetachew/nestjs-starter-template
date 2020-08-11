import { isEmail, IsEmail, IsString, isNotEmpty, IsNotEmpty, Equals, IsOptional } from 'class-validator';
import { Match } from '../../common/match.validation';

import { isString } from 'util';
class NewUserDto {
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

    @IsOptional()
    isAdmin: boolean;

    @IsOptional()
    isActive: boolean;


    @IsOptional()
    accountConfirmed: boolean

    @IsOptional()
    selfRegistered

}

export default NewUserDto;