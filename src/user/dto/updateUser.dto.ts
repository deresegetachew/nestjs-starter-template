import { isEmail, IsEmail, IsString, isNotEmpty, IsNotEmpty, Equals, IsOptional, IsNumber } from 'class-validator';
import { Match } from '../../common/match.validation';

import { isString } from 'util';
class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;


}

export default UpdateUserDto;