import { createMock } from '@golevelup/nestjs-testing';
import { InternalServerError, InvalidCredentials } from '@lib/common';
import { Test, TestingModule } from '@nestjs/testing';
import faker from 'faker';
import { PasswordCipher } from 'src/user/cipher/password';
import { CreateUserDto } from 'src/user/dto';
import AccountWithEmailExistsException from 'src/user/messages/accountWithEmailExists.exception';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {

  let authService: AuthService;
  let userService: UserService;
  let passwordCipher: PasswordCipher;

  let testUser: User;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PasswordCipher,
        {
          provide: UserService,
          useValue: createMock<UserService>()
        }
      ]
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    passwordCipher = moduleRef.get<PasswordCipher>(PasswordCipher);
  });

  describe('userNamePasswordLogin', () => {
    let userServiceFindByEmailSpyMock: jest.SpyInstance;
    let passwordCipherCheckSpy: jest.SpyInstance;

    beforeEach(() => {
      testUser = new User();
      userServiceFindByEmailSpyMock = jest.spyOn(userService, 'findByEmail');
      passwordCipherCheckSpy = jest.spyOn(passwordCipher, 'check');
    });

    afterEach(() => {
      userServiceFindByEmailSpyMock.mockRestore();
      passwordCipherCheckSpy.mockRestore();
    })

    it('throws invalid credentials if email is not found', async () => {
      userServiceFindByEmailSpyMock.mockImplementationOnce(async () => { return undefined });
      passwordCipherCheckSpy.mockResolvedValueOnce(true);

      await expect(authService.userNamePasswordLogin({ email: "dummy@email.com", password: "dummypassword" })).rejects.toThrow(InvalidCredentials);
    })

    it('throws invalid credentials if password does not match', async () => {
      userServiceFindByEmailSpyMock.mockImplementationOnce(async () => { return { testUser } });
      passwordCipherCheckSpy.mockResolvedValueOnce(false);

      await expect(authService.userNamePasswordLogin({ email: "dummy@email.com", password: "dummypassword" })).rejects.toThrow(InvalidCredentials);
    });

    it('returns user detail with out password if user is authenticated', async () => {
      testUser.password = "testPassword";
      testUser.email = "dummy@email.com";
      testUser.firstName = "dummy";

      userServiceFindByEmailSpyMock.mockResolvedValueOnce(testUser);
      passwordCipherCheckSpy.mockResolvedValueOnce(true);

      const result = await authService.userNamePasswordLogin({ email: "dummy@email.com", password: "dummypassword" });
      expect(result).not.toHaveProperty("password");
    });

    it('handles Unknown error gracefully', async () => {
      userServiceFindByEmailSpyMock.mockImplementationOnce(async () => { throw new Error("Unknown Error") });
      await expect(authService.userNamePasswordLogin({ email: "dummy@email.com", password: "dummypassword" })).rejects.toThrow(InternalServerError);
    });

  });


  describe('signup', () => {

    let userServiceSelfRegistrationSpyMock: jest.SpyInstance;
    const newUserDto: CreateUserDto = new CreateUserDto();

    newUserDto.email = faker.internet.email();
    newUserDto.firstName = faker.name.firstName();
    newUserDto.lastName = faker.name.lastName();
    newUserDto.password = faker.internet.password();
    newUserDto.confirmPassword = newUserDto.password;

    beforeEach(() => {
      userServiceSelfRegistrationSpyMock = jest.spyOn(userService, 'selfRegistration');
    })

    afterEach(() => {
      userServiceSelfRegistrationSpyMock.mockRestore();
    })

    it('sign\'s up users successfully', async () => {
      userServiceSelfRegistrationSpyMock.mockResolvedValueOnce(testUser);

      await expect(authService.signUp(newUserDto)).resolves.toEqual(testUser);
    });


    it('throws AccountWithEmailExistsException if an email is already taken', async () => {
      userServiceSelfRegistrationSpyMock.mockImplementationOnce(async () => { throw new AccountWithEmailExistsException('dummy@email.com') });

      await expect(authService.signUp(newUserDto)).rejects.toThrow(AccountWithEmailExistsException);
    })

    it('handles unknown signUp errors gracefully', async () => {
      userServiceSelfRegistrationSpyMock.mockImplementationOnce(async () => { throw new Error('Unknown Error') });

      await expect(authService.signUp(newUserDto)).rejects.toThrow(InternalServerError);
    })
  });

});
