import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.usersRepository.create(createUserDto);
    console.log('newUser', newUser);
    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      // console.log('error=', error.message);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async getUsers() {
    return await this.usersRepository.find();
  }

  async findUsersById(id: number) : Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async deleteUserById(id: number) {
    return await this.usersRepository.delete(id);
  }

  async findUsersByName(username: string):  Promise<User | null> {
    console.log('finduserbyname', username);
    return await this.usersRepository.findOne({ where: { username : username }});
  }

  async uploadAvatar(id: number, avatar: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: id }});
      if (!user) {
        throw new Error('User not found');
      }
      user.avatar = avatar;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Could not upload avatar');
    }
  }
}
