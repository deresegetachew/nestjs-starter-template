import { confirmationEmailSentToYourAccount, successfullySignedUpMessage, welcomeMessage } from '@lib/common';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { SuccessMsg } from './decorator/successMessage.decorator';
import { LoginDto, SignUpDto } from './dto';

type RequestRes = Request & {
    res: any
};

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }



    @Post('login')
    @HttpCode(HttpStatus.OK)
    @SuccessMsg(welcomeMessage())
    loginUP(@Body() loginDto: LoginDto): Promise<User> {
        return this.authService.userNamePasswordLogin(loginDto);
    }

    //how about we attach the message to the request decorator
    //typescript things like omit ... to create entityTypes + responseType


    @Post('signup')
    @SuccessMsg(successfullySignedUpMessage(), confirmationEmailSentToYourAccount())
    async singUp(@Body() signUpDto: SignUpDto): Promise<User> {
        return this.authService.signUp(signUpDto);
    }
}
