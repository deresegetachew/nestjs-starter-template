import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordCipher } from './cipher/password';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';


@Module({
    imports: [TypeOrmModule.forFeature([User, UserRepository])],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, PasswordCipher]
})
export class UserModule { }

