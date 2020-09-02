import { createMock } from '@golevelup/nestjs-testing';
import { InternalServerError, NotFoundError } from '@lib/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import faker from 'faker';
import { PasswordCipher } from '../cipher/password';
import { CreateUserDto } from '../dto';
import AccountWithEmailExistsException from '../messages/accountWithEmailExists.exception';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { UserService } from '../user.service';


describe('UserService', () => {

  let usersRepository: UserRepository
  let userService: UserService;
  let passwordCipher: PasswordCipher;
  let passwordCipherHashSpy: any;



  const newUserDto: CreateUserDto = new CreateUserDto();

  newUserDto.email = faker.internet.email();
  newUserDto.firstName = faker.name.firstName();
  newUserDto.lastName = faker.name.lastName();
  newUserDto.password = faker.internet.password();
  newUserDto.confirmPassword = newUserDto.password;

  const testUser = new User();



  beforeAll(async () => {

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        PasswordCipher,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: createMock<UserRepository>()
        }
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    passwordCipher = moduleRef.get<PasswordCipher>(PasswordCipher);
    usersRepository = moduleRef.get<UserRepository>(getRepositoryToken(UserRepository));

    passwordCipherHashSpy = jest.spyOn(passwordCipher, 'hash');
  });


  it('dependencies should be defined', () => {
    expect(userService).toBeDefined();
    expect(PasswordCipher).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('findAll', () => {
    let userRepoFindSpyMock: jest.SpyInstance;

    beforeEach(() => {
      userRepoFindSpyMock = jest.spyOn(usersRepository, 'find');
    });

    afterEach(() => {
      userRepoFindSpyMock.mockRestore();
    })

    it('should have the repo mocked', () => {
      userRepoFindSpyMock.mockImplementationOnce(async () => { return [testUser] });
      expect(typeof usersRepository.find).toBe('function');
    });
    it('should return an array of users', async () => {
      userRepoFindSpyMock.mockImplementationOnce(async () => { return [testUser] });
      const users = await userService.findAll();

      expect(usersRepository.find).toHaveBeenCalled();
      expect(users).toEqual([testUser])
    });

    it('findAll-gracefully handles unkown errors', async () => {
      userRepoFindSpyMock.mockImplementationOnce(async () => { throw new Error("Unkown Error") });
      await expect(() => userService.findAll()).rejects.toThrowError(InternalServerError);
    });
  })

  describe('self register', () => {
    let userRepoCreateSpyMock: jest.SpyInstance;
    let userRepoCountSpyMock: jest.SpyInstance;
    let userServiceEmailIsAvailableSpyMock: jest.SpyInstance;

    beforeEach(() => {
      userRepoCreateSpyMock = jest.spyOn(usersRepository, 'create');
      userRepoCountSpyMock = jest.spyOn(usersRepository, 'count');
      userServiceEmailIsAvailableSpyMock = jest.spyOn(userService, 'emailIsAvailable');
    });


    afterEach(() => {
      userRepoCreateSpyMock.mockRestore();
      userRepoCountSpyMock.mockRestore();
      userServiceEmailIsAvailableSpyMock.mockRestore();
    })

    it('register non admin user', async () => {

      userRepoCreateSpyMock.mockImplementationOnce((user) => { return new Promise((resolve, reject) => resolve(user)) });
      userRepoCountSpyMock.mockResolvedValueOnce(1);
      userServiceEmailIsAvailableSpyMock.mockResolvedValueOnce(true);

      const newUser = await userService.selfRegistration(newUserDto);


      expect(userService.emailIsAvailable).toHaveBeenCalled();
      expect(usersRepository.count).toHaveBeenCalled();
      expect(passwordCipherHashSpy).toHaveBeenCalledWith(newUserDto.password);
      expect(newUser).toBeDefined();
      expect(newUser).toHaveProperty('isAdmin', false);
    });

    it('register as admin if user database is empty', async () => {
      userRepoCountSpyMock.mockResolvedValueOnce(+0);
      userServiceEmailIsAvailableSpyMock.mockResolvedValueOnce(true);
      userRepoCreateSpyMock.mockImplementationOnce((user) => { return new Promise((resolve, reject) => resolve(user)) });


      const newUser = await userService.selfRegistration(newUserDto);

      expect(userService.emailIsAvailable).toHaveBeenCalled();
      expect(usersRepository.count).toHaveBeenCalled();
      expect(passwordCipherHashSpy).toHaveBeenCalledWith(newUserDto.password);
      expect(newUser).toBeDefined();
      expect(newUser).toHaveProperty('isAdmin', true);
      // expect(newUser.isAdmin).toBe(true);
    });

    it('throws an error if email is already taken', async () => {
      userRepoCountSpyMock.mockResolvedValueOnce(+0);
      userServiceEmailIsAvailableSpyMock.mockResolvedValueOnce(false);

      await expect(() => userService.selfRegistration(newUserDto)).rejects.toThrowError(AccountWithEmailExistsException);
    });

    it('gracefully handels unkown errors', async () => {
      userServiceEmailIsAvailableSpyMock.mockImplementationOnce(async () => { throw new Error("unknown error") });
      await expect(() => userService.selfRegistration(newUserDto)).rejects.toThrowError(InternalServerError);
    });
  });

  describe('findById', () => {
    let userRepoFindOneSpyMock: jest.SpyInstance;


    beforeEach(() => {
      userRepoFindOneSpyMock = jest.spyOn(usersRepository, 'findOne');
    })

    afterEach(() => {
      userRepoFindOneSpyMock.mockRestore();
    })
    it('returns user found', async () => {
      userRepoFindOneSpyMock.mockImplementation(async () => testUser);

      const userFound = await userService.findById('dummyId');

      expect(usersRepository.findOne).toHaveBeenCalledWith('dummyId');
      expect(userFound).toEqual(testUser);
    })

    it('throws NotFoundError if user is not found', async () => {
      userRepoFindOneSpyMock.mockImplementation(async () => undefined);
      await expect(async () => await userService.findById('dummyId')).rejects.toThrowError(new NotFoundError({ entity: 'User', field: 'id', value: 'dummyId' }))
    })

    it('findById - gracefully handles unknown errors', async () => {
      userRepoFindOneSpyMock.mockImplementation(async () => { throw new Error("'Unknown Error") });
      await expect(async () => await userService.findById('dummyId')).rejects.toThrowError(InternalServerError);
    })
  })

  describe('findByEmail', () => {
    let userRepoFindOneSpyMock: jest.SpyInstance;

    beforeEach(() => {
      userRepoFindOneSpyMock = jest.spyOn(usersRepository, 'findOne');
    })

    afterEach(() => {
      userRepoFindOneSpyMock.mockRestore();
    });
    it('returns user found using email', async () => {
      userRepoFindOneSpyMock.mockImplementation(async () => testUser);

      const foundUser = await userService.findByEmail('dummy@email.com');
      expect(usersRepository.findOne).toHaveBeenCalledWith({ email: 'dummy@email.com' });
      expect(foundUser).toBe(testUser);
    });
    it('it throws NotFoundException if user with email doesnt exist', async () => {
      userRepoFindOneSpyMock.mockImplementationOnce(async () => undefined);
      await expect(async () => await userService.findByEmail('dummy@email.com')).rejects.toThrowError(new NotFoundError({ entity: 'User', field: 'email', value: 'dummy@email.com' }));
    })

    it('findByEmail - gracefully handles unknown errors', async () => {
      userRepoFindOneSpyMock.mockImplementationOnce(async () => { throw new Error("Unknown Error") });
      await expect(async () => await userService.findByEmail('dummy@email.com')).rejects.toThrowError(InternalServerError);
    })
  })

  describe('emailIsAvailable', () => {
    let userRepoFindOneSpyMock: jest.SpyInstance;

    beforeEach(() => {
      userRepoFindOneSpyMock = jest.spyOn(usersRepository, 'findOne');
    });

    afterEach(() => {
      userRepoFindOneSpyMock.mockRestore()
    })
    it('returns false if email is already taken', async () => {
      userRepoFindOneSpyMock.mockImplementationOnce(async () => testUser);
      await expect(await userService.emailIsAvailable('dummy@email.com')).toEqual(false);
    });

    it('returns true if email is not taken', async () => {
      userRepoFindOneSpyMock.mockImplementationOnce(async () => null);
      await expect(userService.emailIsAvailable('dummy@email.com')).resolves.toEqual(true);
    });

    it('emailIsAvailable - gracefully handles unknown errors', async () => {
      userRepoFindOneSpyMock.mockImplementationOnce(async () => { throw new Error("Unknown Error") });
      await expect(async () => await userService.emailIsAvailable('dummy@email.com')).rejects.toThrowError(InternalServerError);
    })
  });

  describe('updateUserProfile', () => {
    let userRepoUpdateSpyMock: jest.SpyInstance;
    let userServiceFineByIdSpyMock: jest.SpyInstance;

    beforeEach(() => {
      userRepoUpdateSpyMock = jest.spyOn(usersRepository, "update");
      userServiceFineByIdSpyMock = jest.spyOn(userService, "findById")
    })

    afterEach(() => {
      userRepoUpdateSpyMock.mockRestore();
      userServiceFineByIdSpyMock.mockRestore();
    });

    it("updates users first name and last name", async () => {
      userRepoUpdateSpyMock.mockImplementationOnce(async () => { return new Promise((resolve, reject) => resolve({ affected: 1 })) });
      userServiceFineByIdSpyMock.mockImplementationOnce(async (id) => testUser);

      const updatedUser = await userService.updateProfile("dummyId", { firstName: "dummyFirstName", lastName: "dummyLastName" });
      expect(updatedUser).toEqual(testUser);
    });

    it("throws not found exception when user not found", async () => {
      userRepoUpdateSpyMock.mockResolvedValueOnce({ affected: 0 });
      await expect(userService.updateProfile("dummyId", { firstName: '', lastName: '' })).rejects.toThrow(new NotFoundError({ entity: 'User', field: 'id', value: 'dummyId' }))
    });

    it("updateUserProfile - gracefully handles unknown errors", async () => {
      userRepoUpdateSpyMock.mockImplementationOnce(async () => { throw new Error("Unknown Error") })

      await expect(userService.updateProfile("dummyId", { firstName: '', lastName: '' })).rejects.toThrow(InternalServerError)
    })
  });

  describe('deactivateUser', () => {
    let userRepoUpdateSpyMock: jest.SpyInstance;

    beforeEach(() => {
      userRepoUpdateSpyMock = jest.spyOn(usersRepository, 'update');
    })

    afterEach(() => {
      userRepoUpdateSpyMock.mockRestore();
    });

    it('deactivates the user if it is not an Admin', () => {
      userRepoUpdateSpyMock.mockImplementation(async () => { return new Promise((resolve, reject) => resolve({ affected: 1 })) })
    })
  });

});
