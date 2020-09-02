import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UpdateUserDto } from './dto';
import { User } from './user.entity';


// import { CreateAdminDto } from './dto';


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    // async createUser(createUserDto: CreateUserDto): Promise<User> {
    //     let { email, firstName, lastName, password, selfRegistered, isActive, accountConfirmed } = createUserDto;
    //     let user = new User();

    //     user.email = email;
    //     user.firstName = firstName;
    //     user.lastName = lastName;
    //     user.password = password;
    //     selfRegistered ? user.selfRegistered = selfRegistered : null;
    //     isActive ? user.isActive = isActive : null;
    //     accountConfirmed ? user.accountConfirmed = accountConfirmed : null;


    //     console.log("?????--->");
    //     return this.save(user);

    // }

    async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const { firstName, lastName } = updateUserDto;
        const user = await this.findOne(id)
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