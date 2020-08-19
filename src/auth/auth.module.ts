import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { PasswordCipher } from 'src/user/cipher/password';

@Module({
  imports: [UserModule, PassportModule],
  providers: [AuthService, PasswordCipher],
  exports: [AuthService,],
  controllers: [AuthController]
})
export class AuthModule { }
