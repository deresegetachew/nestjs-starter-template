import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';


// import { CreateAdminDto } from './dto';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        let { email, firstName, lastName, password, selfRegistered, isActive, accountConfirmed } = createUserDto;
        let user = new User();

        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        selfRegistered ? user.selfRegistered = selfRegistered : null;
        isActive ? user.isActive = isActive : null;
        accountConfirmed ? user.accountConfirmed = accountConfirmed : null;


        return await this.save(user);

    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        let { firstName, lastName } = updateUserDto;
        let user = await this.findOne(id)
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;

            await this.save(user);
            return user;
        }
        else
            throw new NotFoundException(`user with ${id} not found`);
    }

}