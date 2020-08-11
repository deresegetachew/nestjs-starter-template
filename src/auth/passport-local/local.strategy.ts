import { Injectable } from "@nestjs/common";
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import InvalidCredentials from '../exception/invalidCredentials.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' });
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.userNamePasswordLogin({ email: username, password });
        if (!user) {
            throw new InvalidCredentials(username);
        }
        //console.log(user);
        return user;
    }
}