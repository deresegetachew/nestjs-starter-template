import { InternalServerError, NotFoundError } from '@lib/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordCipher } from 'src/user/cipher/password';
import { Not } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import AccountWithEmailExistsException from './messages/accountWithEmailExists.exception';
import { User } from './user.entity';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly usersRepository: UserRepository,
        private passwordCipher: PasswordCipher
    ) { }

    async findAll(): Promise<User[]> {
        try {
            return await this.usersRepository.find();
        }
        catch (error) {
            throw new InternalServerError(error.message);
        }
    }

    async findById(id: string): Promise<User> {
        try {
            const data = await this.usersRepository.findOne(id);
            if (!data)
                throw new NotFoundError({ entity: 'User', field: 'id', value: id });

            return data;
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw error;

            throw new InternalServerError(error.message);
        }
    }

    async findByEmail(email: string): Promise<User> {
        try {

            const data = await this.usersRepository.findOne({ email });


            if (!data)
                throw new NotFoundError({ entity: 'User', field: 'email', value: email });

            return data;
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw error;

            throw new InternalServerError(error.message);
        }
    }

    async emailIsAvailable(email: string): Promise<boolean> {
        try {
            const user = await this.usersRepository.findOne({ email });
            if (user) return false;
            return true;
        }
        catch (error) {
            //console.log("???", error);
            throw new InternalServerError(error.message);
        }
    }

    async selfRegistration(user: CreateUserDto): Promise<User> {
        try {
            //check if email is already taken
            const emailAvailable = await this.emailIsAvailable(user.email);

            if (emailAvailable) {
                const count = await this.usersRepository.count({});

                if (!count) {
                    //register as admin
                    user.isAdmin = true;
                    user.selfRegistered = true;
                    user.isActive = true;
                    user.accountConfirmed = false;
                }
                else {
                    user.isAdmin = false;
                    user.selfRegistered = true;
                    user.isActive = true;
                    user.accountConfirmed = false;
                }

                const hashedPass = await this.passwordCipher.hash(user.password);
                return await this.usersRepository.create({ ...user, password: hashedPass });
            }
            else
                throw new AccountWithEmailExistsException(user.email);
        }
        catch (error) {
            if (error instanceof AccountWithEmailExistsException)
                throw error;
            else
                throw new InternalServerError(error.message);
        }
    }

    async updateProfile(id: string, userDetail: UpdateUserDto): Promise<User> {
        try {

            const { affected } = await this.usersRepository.update({ "id": id }, { ...userDetail });

            if (!affected)
                throw new NotFoundError({ entity: 'User', field: 'id', value: id });

            return await this.findById(id);
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw error;

            throw new InternalServerError(error.message);
        }
    }

    async deactivateUser(id: string): Promise<boolean> {

        try {
            const { affected } = await this.usersRepository.update({ id, deletedAt: null, isAdmin: false }, { deletedAt: new Date() });
            if (affected)
                return true
            else
                throw new NotFoundError({ entity: 'User', field: 'id', value: id });
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw error;

            throw new InternalServerError(error.message);
        }
    }

    //activate an inactive user
    async activateUser(id: string): Promise<boolean> {
        try {
            const { affected } = await this.usersRepository.update({ id, deletedAt: Not(null) }, { deletedAt: null });

            if (affected)
                return true;
            else
                throw new NotFoundError({ entity: 'User', field: 'id', value: id });
        }
        catch (error) {
            if (error instanceof NotFoundError)
                throw error;

            throw new InternalServerError(error.message);
        }
    }
}
