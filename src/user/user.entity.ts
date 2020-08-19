import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty } from "class-validator";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 250 })
    @Unique("user_unique_email", ['email'])
    @IsNotEmpty()
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
    password: string;


    @Column({ default: true })
    @Exclude()
    isActive: boolean;

    @Column({ default: false })
    @Exclude()
    isAdmin: boolean;

    @Column({ default: false })
    accountConfirmed: boolean

    @Column({ default: false })
    @Exclude()
    passwordReset: boolean

    @Column({ default: true }) //false it was created by admin
    @Exclude()
    selfRegistered: boolean

    @Column({ default: 'en' })
    locale: string

    @CreateDateColumn()
    @Exclude()
    createdAt

    @UpdateDateColumn()
    @Exclude()
    updatedAt


}


