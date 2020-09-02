import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";
import { SoftDeletable } from 'src/common/entity/entity-types';
import { Column, Entity, Unique } from "typeorm";
import { AppBaseEntity } from '../../src/common/entity/base.entity';

@Entity()
export class User extends AppBaseEntity implements SoftDeletable {

    @Column({ type: "varchar", length: 250 })
    @Unique("user_unique_email", ['email'])
    @IsNotEmpty()
    @IsEmail()
    @Expose()
    email: string;

    @Column({ type: "varchar", length: 250 })
    @IsNotEmpty()
    firstName: string;

    @Column({ type: "varchar", length: 250 })
    lastName: string;

    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @Column({ type: "varchar", length: 250 })
    @Exclude()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    password: string;

    @Column({ default: true })
    @Exclude()
    isActive: boolean;

    @Column({ default: false })
    @Exclude()
    isAdmin: boolean;

    @Column({ default: false })
    @IsOptional()
    accountConfirmed: boolean

    @Column({ default: false })
    @Exclude()
    @IsOptional()
    passwordReset: boolean

    @Column({ default: true }) //false it was created by admin
    @Exclude()
    @IsOptional()
    selfRegistered: boolean

    @Column({ default: 'en' })
    locale: string

    @Column({ type: Date, nullable: true })
    @IsOptional()
    deletedAt: Date | null;
}


