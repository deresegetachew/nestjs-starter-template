import { Module, Controller } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { PasswordCipher } from './cipher/password';


@Module({
    imports: [TypeOrmModule.forFeature([User, UserRepository])],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService, PasswordCipher]
})
export class UserModule { }

