import { Controller, Get, Post, Body, Param, UsePipes, ValidationPipe, ParseIntPipe, Delete, NotImplementedException, UseInterceptors, ClassSerializerInterceptor, Put, SerializeOptions } from '@nestjs/common';
import { UserService } from './user.service';
import { ResetPasswordDto, CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';


@Controller('users')
@SerializeOptions({
    strategy: 'excludeAll'
})
export class UserController {
    constructor(private userService: UserService) { }


    // @Get("/logout")
    // logout() {
    //     //logout from hydra
    // }

    @Post("register")
    register(@Body() data: CreateUserDto) {
        this.userService.create(data);
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
    useDetail(@Param('id', ParseIntPipe) id: number): Promise<User | undefined> {
        return this.userService.findById(id);
    }


    @Put('/:id')
    updateUserDetail(@Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateUserDto): Promise<User> {
        return this.userService.updateUserDetail(id, data);
    }


    // @Put('/admin')
    // toggleAdmin() {
    //     return this.userService.toggleAdmin();
    // }

    // @Put('/active')
    // toggleActiveStatus() {
    //     return this.userService.toggleActive();
    // }


    @Delete("/:id")
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.deactivateUser(id);
    }

}
