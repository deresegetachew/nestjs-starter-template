import { ValidationPipeService } from '@lib/validation-pipe';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';


@Controller('users')
// @SerializeOptions({
//     strategy: 'excludeAll'
// })
export class UserController {



    constructor(private userService: UserService) {
    }



    // @Get("/logout")
    // logout() {
    //     //logout from hydra
    // }

    @Post("register")
    register(@Body() data: CreateUserDto) {
        this.userService.selfRegistration(data);
    }

    // @Post("/reset")
    // resetPassword(@Body() data: ResetPasswordDto) {
    //     throw new NotImplementedException();
    // }

    // @Post('/forgotPassword/:email')
    // forgotPassword(@Param('email') email: string) {
    //     throw new NotImplementedException();
    // }

    @Post('/create')
    creat() {
        //only admin Role can create other users using this
        //selfRegisteration should be set to false when using this
        //passwordReset should also be set to false here because user needs to reset it on first login
    }

    @Get()
    getUsers(): Promise<User[]> {
        return this.userService.findAll();
    }


    @Get("/:id")
    userDetail(
        @Param('id', new ParseUUIDPipe({
            errorHttpStatusCode: HttpStatus.BAD_REQUEST,
            exceptionFactory: ValidationPipeService.parseUUIDPipeErrorFactory('id')
        })) id: string): Promise<User> {
        //throw new UnauthorizedException();
        return this.userService.findById(id);
    }


    @Put('/:id')
    updateProfile(@Param('id', new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: ValidationPipeService.parseUUIDPipeErrorFactory('id')
    })) id: string,
        @Body() data: UpdateUserDto): Promise<User> {
        return this.userService.updateProfile(id, data);
    }


    // @Put('/admin')
    // toggleAdmin() {
    //     return this.userService.toggleAdmin();
    // }

    // @Put('/active')
    // toggleActiveStatus() {
    //     return this.userService.toggleActive();
    // }


    @Post("/deactivate/:id")
    @HttpCode(HttpStatus.OK)
    deactivateUser(@Param('id', new ParseUUIDPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: ValidationPipeService.parseUUIDPipeErrorFactory('id')
    })) id: string): Promise<boolean> {
        return this.userService.deactivateUser(id);
    }

}
