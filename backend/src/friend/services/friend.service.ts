import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { any } from 'joi';
import { send } from 'process';
import { Friend, FriendStatus } from 'src/typeorm/friends.entity';
import { UsersService } from 'src/users/services/users.service';
import { In, Not, Repository } from 'typeorm';
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

  async update(id: number, updateFriendDto: UpdateFriendDto) {
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

  async sendFriendRequest(senderId: number, receiverId: number) {
    const sender = await this.userService.findUsersById(senderId);
    const receiver = await this.userService.findUsersById(receiverId);
    if (!sender || !receiver) {
      throw new NotFoundException('Invalid sender or receiver');
    }
    if (sender.id === receiver.id) {
      throw new ConflictException('sender and receiver same');
    }
    const existingFriend = await this.friendRepository.findOne({
      where: {
        sender: { id: senderId },
        receiver: { id: receiverId },
      },
    });

    if (existingFriend) {
      if (existingFriend.status === FriendStatus.Pending || 
          existingFriend.status === FriendStatus.Friended) {
        throw new ConflictException('Friend request already exists');
      } else if (existingFriend.status === FriendStatus.Cancel ||
          existingFriend.status === FriendStatus.Decline) {
        existingFriend.status = FriendStatus.Pending;
        existingFriend.sender = sender;
        existingFriend.receiver = receiver;
        return await this.friendRepository.save(existingFriend);
      }
    }

    const friend = new Friend();
    friend.sender = sender;
    friend.receiver = receiver;
    friend.status = FriendStatus.Pending;
    return await this.friendRepository.save(friend);
  }

  async acceptFriendRequest(friendRequestId: number) {
    await this.friendRepository.update(friendRequestId, { status: FriendStatus.Friended });
    const updatedFriendRequest = await this.findOne(friendRequestId);
    return updatedFriendRequest;
    // return await this.friendRepository.update(friendRequestId, { status: FriendStatus.Friended });
  }

  async declineFriendRequest(friendRequestId: number) {
    await this.friendRepository.update(friendRequestId, { status: FriendStatus.Decline });
    const updatedFriendRequest = await this.findOne(friendRequestId);
    return updatedFriendRequest;
    // return await this.friendRepository.update(friendRequestId, { status: FriendStatus.Decline });
  }

  async cancelFriendRequest(friendRequestId: number) {
    await this.friendRepository.update(friendRequestId, { status: FriendStatus.Cancel });
    const updatedFriendRequest = await this.findOne(friendRequestId);
    return updatedFriendRequest;
    // return await this.friendRepository.update(friendRequestId, { status: FriendStatus.Cancel });
  }

  async getSentFriendRequest(senderId: number) {
    const sentFriendRequest = await this.friendRepository.find({
      where: {
        sender: { id: senderId },
        // status: FriendStatus.Friended,
        status: Not(In([FriendStatus.Cancel, FriendStatus.Decline])),
      },
      relations: ['sender', 'receiver'],
    });
    return sentFriendRequest;
  }

  async getReceivedFriendRequest(receiverId: number) {
    console.log('receiverId', receiverId);
    
    const receivedFriendRequest = await this.friendRepository.find({
      where: {
        receiver: { id: receiverId },
        // status: FriendStatus.Friended,
        status: Not(In([FriendStatus.Cancel, FriendStatus.Decline])),
      },
      relations: ['sender', 'receiver'],
    });
    return receivedFriendRequest;
  }

  async handleFriendRequestWebhook(body: any) {
    const { event, data } = body;
    const { senderId, receiverId } = data;
    if (event === 'friend-request-sent') {
      return await this.sendFriendRequest(senderId, receiverId);
    } else if (event === 'friend-request-accepted') {
      return await this.acceptFriendRequest(data.friendRequestId);
    } else if (event === 'friend-request-declined') {
      return await this.declineFriendRequest(data.friendRequestId);
    } else if (event === 'friend-request-cancelled') {
      return await this.cancelFriendRequest(data.friendRequestId);
    } else {
      throw new BadRequestException('Invalid event');
    }
  }

  async getFriendRequests(userId: number) {
    const sentFriendRequest = await this.getSentFriendRequest(userId);
    const receivedFriendRequest = await this.getReceivedFriendRequest(userId);
    const friendRequest = [];
    if (sentFriendRequest.length > 0) {
      friendRequest.push(...sentFriendRequest);
    }
    if (receivedFriendRequest.length > 0) {
      friendRequest.push(...receivedFriendRequest);
    }
    return friendRequest;
  }

  async deleteAll() {
    try {
      await this.friendRepository.clear();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete all friend', error);
    }
  }
}
