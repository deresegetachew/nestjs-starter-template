import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { SuccessMsg } from './decorator/successMessage.decorator';
import { LoginDto, SignUpDto } from './dto';
import { welcomeMessage } from './messages';


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
    // @SuccessMsg(successfullySignedUp(),anEmailHasBeenSentToYourAccount())
    async singUp(@Body() signUpDto: SignUpDto): Promise<User> {
        return this.authService.signUp(signUpDto);
    }
}
