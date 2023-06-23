import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { StatService } from 'src/stat/services/stat.service';
import { CreateStatDto } from 'src/stat/dto/create-stat.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly statService: StatService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const newUser = this.usersRepository.create(createUserDto);
    console.log('test', newUser);
    try {
      const dto = new CreateStatDto();
      const returnUser = await this.usersRepository.save(newUser);
      await this.statService.create(newUser.id, dto);
      return returnUser;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async getUsers() {
    return await this.usersRepository.find();
  }

  async findUsersById(id: number): Promise<User | null> {
    if (id === undefined) {
      return null;
    }
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new InternalServerErrorException('User not found');
    return user;
  }

  async findUsersByIntraId(intra_uid: number): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        intra_uid: intra_uid,
      },
    });
    if (!user) return null;
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async deleteUserById(id: number) {
    const user = await this.findUsersById(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return await this.usersRepository.delete(id);
  }

  async findUsersByName(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!user)
      throw new NotFoundException(`User with username: ${username} not found`);
    return await user;
  }

  async uploadAvatar(id: number, avatar: string) {
    try {
      const user = await this.findUsersById(id);
      user.avatar = avatar;
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException('Could not upload avatar');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('No update data provided');
    }
    try {
      const updatedUserDto = {
        ...updateUserDto,
        updatedAt: new Date(),
      };
      await this.usersRepository.update(id, updatedUserDto);
      return await this.findUsersById(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // Set authentication to true
  async authenticateUser(id: number) {
    await this.updateUser(id, {
      authentication: true,
    });
  }

  async findUsersByIdWithRelation(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: [
        'userAchievement',
        'userAchievement.achievement',
        'stat',
        'p1_match',
        'p1_match.p1_uid',
        'p1_match.p2_uid',
        'p2_match',
        'p2_match.p1_uid',
        'p2_match.p2_uid',
        'sentFriendRequest',
        'sentFriendRequest.receiver',
        'sentFriendRequest.sender',
        'receiveFriendRequest',
        'receiveFriendRequest.receiver',
        'receiveFriendRequest.sender',
      ],
      where: {
        id: id,
      },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return await user;
  }
}
