import { createMock } from '@golevelup/nestjs-testing';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';

describe('Auth', () => {
    let app: INestApplication;
    let authService = {};

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AuthModule],
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>
                },
            ]
        })
            .overrideProvider(AuthService)
            .useValue(authService)
            .compile()

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    })
})