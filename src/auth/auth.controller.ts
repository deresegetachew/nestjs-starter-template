import { Controller, Post, Body, ClassSerializerInterceptor, UseInterceptors, UseGuards, Res, HttpStatus, HttpCode, Req, SetMetadata } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import IRequestWithUser from './interface/IRequestWithUser';
import { messageEnums } from '../common/localeKey.enum';
import { welcomeMessage } from './messages';
import { IAppResponse } from '@lib/common';
import { SuccessMsg } from './decorator/successMessage.decorator';


type RequestRes = Request & {
    res: any
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    // @Post('/login')
    // @UseGuards(LocalAuthGuard)
    // @HttpCode(HttpStatus.OK)
    // @SuccessMsg(welcomeMessage(), welcomeMessage())
    // login(@Req() req: IRequestWithUser) {
    //     return req.user;
    // }



    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @SuccessMsg(welcomeMessage())
    loginUP(@Body() loginDto: LoginDto): Promise<User> {
        return this.authService.userNamePasswordLogin(loginDto);
    }

    //how about we attach the mesage to the request ?? decorator
    //typescript things like omit ... to create entityTypes + responseType


    @Post('signup')
    async singUp(@Body() signUpDto: SignUpDto): Promise<User> {
        return this.authService.signUp(signUpDto);
    }
}
