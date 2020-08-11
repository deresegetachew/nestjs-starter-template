import { Injectable, Inject, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto';
import { User } from '../user/user.entity';
import { HttpError } from '@oryd/keto-client';
import { UserRepository } from 'src/user/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';



@Injectable()
export class AuthService {
    constructor(

        private userService: UserService) { }


    async userNamePasswordLogin(data: LoginDto): Promise<any> {
        const { email, password } = data;

        const user: User = await this.userService.findByEmail(email);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }

        return null;

        //if active == false & accountConfirmed == false send error asking user to first confirm account.
        //if active == true && accountConfirmed == false login is success but send back a message asking user to confirm account.
    }


    async facebookLogin() {

    }

    async gmailLogin() {

    }

    async githubLogin() {

    }

    async twitterLogin() {

    }

    async signUp(data: SignUpDto): Promise<User> {
        return this.userService.create({ ...data, isAdmin: false, isActive: true, selfRegistered: true, accountConfirmed: false });
    }

    async logout() {

    }

    async resetPassword() {

    }

    async forgotPassword() {

    }

}
