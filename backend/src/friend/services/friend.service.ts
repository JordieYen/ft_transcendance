import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { send } from 'process';
import { Friend } from 'src/typeorm/friends.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateFriendDto } from '../dto/create-friend.dto';
import { UpdateFriendDto } from '../dto/update-friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    private readonly userService: UsersService,
  ) {}

  async create(createFriendDto: CreateFriendDto) {
    const { senderId, receiverId, status } = createFriendDto;
    const sender = await this.userService.findUsersById(senderId);
    const receiver = await this.userService.findUsersById(receiverId);
    if (!sender || !receiver) {
      throw new NotFoundException('Invalid sender or receiver');
    }
    if (sender === receiver) {
      throw new ConflictException('sender and receiver same');
    }
    const existingFriend = await this.friendRepository.findOne({
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
      },
    });

    if (existingFriend) {
      throw new ConflictException('Friend already exists');
    }

    const friend = new Friend();
    friend.sender = sender;
    friend.receiver = receiver;
    friend.status = status;
    return await this.friendRepository.save(friend);
  }

  async findAll(): Promise<Friend[]> {
    return await this.friendRepository.find({
      relations: [ 'sender', 'receiver' ],
    });
  }

  async findOne(id: number) {
    const friend = await this.friendRepository.findOne({
      relations: [ 'sender', 'receiver' ],
      where: {
        id: id
      }});
    if (!friend)
      throw new Error('Friend not found');
    return (friend);
  }

  async update(id: number, updateFriendDto: Partial<UpdateFriendDto>) {
    if (!updateFriendDto || Object.keys(updateFriendDto).length === 0) {
      throw new BadRequestException('No update data provided');
    }
    const friend = await this.findOne(id);
    try {
      const sender = await this.userService.findUsersById(updateFriendDto.senderId);
      const receiver = await this.userService.findUsersById(updateFriendDto.receiverId);
      friend.sender = sender;
      friend.receiver = receiver;
      friend.status = updateFriendDto.status;
      await this.friendRepository.update(id, friend);
      return await this.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update friend', error);
    }
  }

  async remove(id: number) {
    const friend = await this.findOne(id);
    if (!friend) {
      throw new NotFoundException(`friend with ID ${id} not found`);
    }
    return await this.friendRepository.delete(id);
  }
}
