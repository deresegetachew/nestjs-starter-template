import { InternalServerError, NotFoundError } from '@lib/common';
import { Injectable, NotImplementedException } from '@nestjs/common';
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

        try {
            const user: User = await this.userService.findByEmail(email);
            if (user && await this.passwordCipher.check(password, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            else
                throw new InvalidCredentialsException(email);
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw new InvalidCredentialsException(email);
            else
                throw new InternalServerError(error.message);
        }


        //if active == false & accountConfirmed == false send error asking user to first confirm account.
        //if active == true && accountConfirmed == false login is success but send back a message asking user to confirm account.
    }


    async facebookLogin() {
        throw new NotImplementedException();
    }

    async gmailLogin() {
        throw new NotImplementedException();
    }

    async githubLogin() {
        throw new NotImplementedException();
    }

    async twitterLogin() {
        throw new NotImplementedException();
    }

    async signUp(data: SignUpDto): Promise<User> {
        return this.userService.selfRegistration({ ...data, isAdmin: false, isActive: true, selfRegistered: true, accountConfirmed: false });
    }

    async logout() {

    }

    async resetPassword() {

    }

    async forgotPassword() {

    }

}
