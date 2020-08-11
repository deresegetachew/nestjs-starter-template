import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 250 })
    @Unique("user_unique_email", ['email'])
    email: string;

    @Column({ type: "varchar", length: 250 })
    @Unique("unique_first_name", ["firstName"])
    firstName: string;

    @Column({ type: "varchar", length: 250 })
    lastName: string;

    @Column({ type: "varchar", length: 120 })
    @Exclude()
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
