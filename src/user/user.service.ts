import { Injectable, NotFoundException, InternalServerErrorException, ValidationPipe, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import { isEmail, IsEmail } from 'class-validator';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private usersRepository: UserRepository,
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

        let count = await this.usersRepository.count({});
        if (count == 0) {
            //register as admin
            user.isAdmin = true;
        }
        return await this.usersRepository.createUser(user);
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
