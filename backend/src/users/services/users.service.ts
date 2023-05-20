import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';
import { HttpService } from '@nestjs/axios';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
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
    if (id === undefined) {
      return null;
    }
    const user = await this.usersRepository.findOne({ 
      where: { 
        id: id 
      }});
    if (!user)
       throw new Error('User not found');
    return (user);
  }

  async findUsersByIntraId(intra_uid: number) : Promise<User | null> {
    return await this.usersRepository.findOne({
      where: {
        intra_uid: intra_uid
      }});
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async deleteUserById(id: number) {
    const user = await this.findUsersById(id);
    if (!user)
      throw new NotFoundException(`User with ID ${id} not found`);
    return await this.usersRepository.delete(id);
  }

  async findUsersByName(username: string):  Promise<User | null> {
    console.log('finduserbyname', username);
    return await this.usersRepository.findOne({ 
      where: { 
        username : username
      }});
  }

  async uploadAvatar(id: number, avatar: string) {
    try {
      const user = await this.findUsersById(id)
      user.avatar = avatar;
      return await this.usersRepository.save(user);
    } catch (error) {
        throw new InternalServerErrorException('Could not upload avatar');
    }
  }

  async updateUser(id: number, UpdateUserDto: Partial<UpdateUserDto>) : Promise<User> {
    try {
      const updatedUserDto = {
        ...UpdateUserDto,
        updatedAt: new Date(),
      }
      await this.usersRepository.update(id, updatedUserDto);
      return await this.usersRepository.findOneBy({
        id: id 
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

   async findUsersByIdWithRelation(id: number): Promise<User> {
    const user = this.usersRepository.findOne({
      relations: [
        'userAchievement',
        'userAchievement.achievement',
      ],
      where: {
        id: id,
      }
    })
    if (!user)
      throw new NotFoundException(`User with ID ${id} not found`);
    return await user;
   }



}
