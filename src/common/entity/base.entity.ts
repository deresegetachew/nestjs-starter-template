import { Expose } from 'class-transformer';
import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class AppBaseEntity {
    @PrimaryGeneratedColumn("uuid")
    @Expose()
    id: string;

    @CreateDateColumn() createdAt: Date;

    @UpdateDateColumn() updatedAt: Date;

    @DeleteDateColumn() deletedAt: Date;
}