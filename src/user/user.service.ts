import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordCipher } from 'src/user/cipher/password';
import { CreateUserDto, UpdateUserDto } from './dto';
import AccountWithEmailExistsException from './messages/accountWithEmailExists.exception';
import { User } from './user.entity';
import { UserRepository } from './user.repository';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
        private passwordCipher: PasswordCipher
    ) { }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findById(id: number): Promise<User> {
        let data = await this.usersRepository.findOne(id);
        if (!data)
            throw new NotFoundException(`User with ID ${id} doesnot exist`);

        return data;
    }

    async findByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({ email });
    }

    async emailIsAvailable(email: string): Promise<boolean> {
        let user = await this.usersRepository.findOne({ email });
        if (user) return false;
        else return true;
    }

    async create(user: CreateUserDto): Promise<User> {

        //check if email is already taken
        let emailAvailable = await this.emailIsAvailable(user.email);

        if (emailAvailable) {
            let count = await this.usersRepository.count({});
            if (count == 0) {
                //register as admin
                user.isAdmin = true;
            }

            const hashedPass = await this.passwordCipher.hash(user.password);
            return await this.usersRepository.createUser({ ...user, password: hashedPass });
        }
        else
            throw new AccountWithEmailExistsException(user.email);
    }

    async updateUserDetail(id: number, userDetail: UpdateUserDto): Promise<User> {
        return this.usersRepository.updateUser(id, userDetail);
    }

    async deactivateUser(id: number): Promise<void> {
        let _user = await this.usersRepository.findOne(id);
        if (_user) {
            if (_user.isAdmin)
                throw new InternalServerErrorException(`User is an Admin, can not delete Admin`);
            else {
                this.usersRepository.remove(_user);
            }
        }
        else
            throw new NotFoundException(`User with ID ${id} not found`);


    }

}
