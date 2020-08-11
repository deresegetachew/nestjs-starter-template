import { Controller, Post, Body, Request, ClassSerializerInterceptor, UseInterceptors, UseGuards, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { LocalAuthGuard } from './guards/local-auth-guard.guard';
import { response } from 'express';


@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }


    @Post('/login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    login(@Request() req) {
        return req.user
    }


    @Post('signup')
    singUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }
}
