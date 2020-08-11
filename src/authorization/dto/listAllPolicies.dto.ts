import { isEmail, IsEmail, IsString, isNotEmpty, IsNotEmpty, Equals, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import IFlavor from '../interfaces/IFlavor';
import { IAccessControlPolciy, IEffect } from '../interfaces/IAccessControlPolicy';


class ListAllPoliciesDto_Request {

    @IsEnum(IFlavor)
    flavor: IFlavor;

    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsNumber()
    offset?: number;

    @IsOptional()
    @IsString()
    subject?: string

    @IsOptional()
    @IsString()
    resource?: string

    @IsOptional()
    @IsString()
    action?: string
}


class ListAllPoliciesDto_Response implements IAccessControlPolciy {
    @IsOptional()
    @IsString({ each: true })
    actions;

    @IsOptional()
    conditions;


    @IsOptional()
    @IsString()
    description;

    @IsOptional()
    @IsEnum(IEffect)
    effect;

    @IsOptional()
    @IsString()
    id;


    @IsOptional()
    @IsString({ each: true })
    resources;


    @IsOptional()
    @IsString({ each: true })
    subjects;
}

export { ListAllPoliciesDto_Request, ListAllPoliciesDto_Response };