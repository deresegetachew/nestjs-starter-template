import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PasswordCipher } from '../user/cipher/password';
import { User } from '../user/user.entity';
import { LoginDto, SignUpDto } from './dto';
import { InvalidCredentialsException } from './messages';



@Injectable()
export class AuthService {
    constructor(

        private userService: UserService, private passwordCipher: PasswordCipher) { }


    async userNamePasswordLogin(data: LoginDto): Promise<any> {
        const { email, password } = data;

        const user: User = await this.userService.findByEmail(email);
        if (user && await this.passwordCipher.check(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        else
            throw new InvalidCredentialsException(email);

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
