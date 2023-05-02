import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { Users } from 'src/typeorm/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    console.log(newUser);
    try {
      return await this.usersRepository.save(newUser);
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  getUsers() {
    return this.usersRepository.find();
  }

  findUsersById(id: number) : Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async deleteUserById(id: number) {
    return await this.usersRepository.delete(id);
  }

  async findUsersByName(username: string): Promise<Users> {
    return await this.usersRepository.findOneBy({ username });
  }
}
