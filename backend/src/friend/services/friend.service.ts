import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend, FriendStatus } from 'src/typeorm/friends.entity';
import { UsersService } from 'src/users/services/users.service';
import { CreateFriendDto } from '../dto/create-friend.dto';
import { UpdateFriendDto } from '../dto/update-friend.dto';
import { Repository } from 'typeorm';
import { ChannelService } from 'src/chat/channel/channel.service';
import { CreateChannelDto, JoinChannelDto } from 'src/chat/channel/dto';
import { User } from 'src/typeorm/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    private readonly userService: UsersService,
    private readonly channelService: ChannelService,
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
      relations: ['sender', 'receiver'],
    });
  }

  async findOne(id: number) {
    const friend = await this.friendRepository.findOne({
      relations: ['sender', 'receiver'],
      where: {
        id: id,
      },
    });
    if (!friend) throw new Error('Friend not found');
    return friend;
  }

  async update(id: number, updateFriendDto: UpdateFriendDto) {
    if (!updateFriendDto || Object.keys(updateFriendDto).length === 0) {
      throw new BadRequestException('No update data provided');
    }
    const friend = await this.findOne(id);
    try {
      if (updateFriendDto.senderId) {
        const sender = await this.userService.findUsersById(
          updateFriendDto.senderId,
        );
        friend.sender = sender;
      }
      if (updateFriendDto.receiverId) {
        const receiver = await this.userService.findUsersById(
          updateFriendDto.receiverId,
        );
        friend.receiver = receiver;
      }
      if (updateFriendDto.status) {
        friend.status = updateFriendDto.status;
      }
      if (updateFriendDto.roomId) {
        friend.roomId = updateFriendDto.roomId;
      } else friend.roomId = null;
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
      where: [
        {
          sender: { id: senderId },
          receiver: { id: receiverId },
        },
        {
          sender: { id: receiverId },
          receiver: { id: senderId },
        },
      ],
    });

    if (existingFriend) {
      if (
        existingFriend.status === FriendStatus.Pending ||
        existingFriend.status === FriendStatus.Friended
      ) {
        throw new ConflictException('Friend request already exists');
      } else if (
        existingFriend.status === FriendStatus.Cancel ||
        existingFriend.status === FriendStatus.Decline
      ) {
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
    await this.friendRepository.update(friendRequestId, {
      status: FriendStatus.Friended,
    });
    const updatedFriendRequest = await this.findOne(friendRequestId);
    const sender = await this.userService.findUsersById(
      updatedFriendRequest.sender.id,
    );
    const receiver = await this.userService.findUsersById(
      updatedFriendRequest.receiver.id,
    );
    this.channelService.createChannelInFriendRequest(sender, receiver);
    return updatedFriendRequest;
  }

  // async acceptFriendRequest(friendRequestId: number) {
  //   await this.friendRepository.update(friendRequestId, {
  //     status: FriendStatus.Friended,
  //   });
  //   const updatedFriendRequest = await this.findOne(friendRequestId);
  //   return updatedFriendRequest;
  // }

  async declineFriendRequest(friendRequestId: number) {
    await this.friendRepository.update(friendRequestId, {
      status: FriendStatus.Decline,
    });
    const updatedFriendRequest = await this.findOne(friendRequestId);
    return updatedFriendRequest;
  }

  async unFriend(friendRequestId: number) {
    await this.friendRepository.update(friendRequestId, {
      status: FriendStatus.Cancel,
    });
    const updatedFriendRequest = await this.findOne(friendRequestId);
    const sender = await this.userService.findUsersById(
      updatedFriendRequest.sender.id,
    );
    const receiver = await this.userService.findUsersById(
      updatedFriendRequest.receiver.id,
    );
    this.channelService.deleteChannelInUnfriend(sender, receiver);
    return updatedFriendRequest;
  }

  // inn blocking user, blocker is the sender and blocked is the receiver
  async blockUser(
    friendRequestId: number,
    blockerId: number,
    blockedId: number,
  ) {
    const friendRequest = await this.friendRepository.findOne({
      where: {
        id: friendRequestId,
      },
      relations: ['sender', 'receiver'],
    });

    const blocker = await this.userService.findUsersById(blockerId);
    const blocked = await this.userService.findUsersById(blockedId);
    friendRequest.roomId = null;

    if (friendRequest) {
      friendRequest.status = FriendStatus.Blocked;
      friendRequest.sender = blocker;
      friendRequest.receiver = blocked;
    }
    await this.channelService.muteBothUserInBlock(blocker.id, blocked.id);
    await this.friendRepository.save(friendRequest);
    return friendRequest;
  }

  // async blockUser(friendRequestId: number) {
  //   await this.friendRepository.update(friendRequestId, {
  //     status: FriendStatus.Blocked,
  //   });
  //   const updatedFriendRequest = await this.findOne(friendRequestId);
  //   return updatedFriendRequest;
  //   // return await this.friendRepository.update(friendRequestId, { status: FriendStatus.Blocked });
  // }

  async getSentFriendRequest(senderId: number) {
    const sentFriendRequest = await this.friendRepository.find({
      where: {
        sender: { id: senderId },
        status: FriendStatus.Pending,
        // status: Not(In([FriendStatus.Cancel, FriendStatus.Decline, FriendStatus.Friended])),
      },
      relations: ['sender', 'receiver'],
    });
    return sentFriendRequest;
  }

  async getReceivedFriendRequest(receiverId: number) {
    const receivedFriendRequest = await this.friendRepository.find({
      where: {
        receiver: { id: receiverId },
        status: FriendStatus.Pending,
        // status: Not(In([FriendStatus.Cancel, FriendStatus.Decline, FriendStatus.Friended])),
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
      return await this.unFriend(data.friendRequestId);
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
      throw new InternalServerErrorException(
        'Failed to delete all friend',
        error,
      );
    }
  }

  async getFriends(userId: number) {
    const friends = await this.friendRepository.find({
      where: [
        {
          sender: { id: userId },
          status: FriendStatus.Friended,
        },
        {
          receiver: { id: userId },
          status: FriendStatus.Friended,
        },
      ],
      relations: ['sender', 'receiver'],
    });

    const filteredFriends = friends.map((friend) => {
      const friendData =
        friend.sender.id === userId ? friend.receiver : friend.sender;
      return { ...friendData, roomId: friend.roomId };
    });
    return filteredFriends;
  }

  async getFriendsBoth(userId: number) {
    const friends = await this.friendRepository.find({
      where: [
        {
          sender: { id: userId },
          status: FriendStatus.Friended,
        },
        {
          receiver: { id: userId },
          status: FriendStatus.Friended,
        },
      ],
      relations: ['sender', 'receiver'],
    });
    return friends;
  }

  async findFriendship(senderId: number, receiverId: number) {
    const friendship = await this.friendRepository.findOne({
      where: [
        {
          sender: { id: senderId },
          receiver: { id: receiverId },
        },
        {
          sender: { id: receiverId },
          receiver: { id: senderId },
        },
      ],
    });
    return friendship || null;
  }

  async getBlockedUsers(userId: number) {
    const blockList = await this.friendRepository.find({
      where: {
        sender: { id: userId },
        status: FriendStatus.Blocked,
      },
      relations: ['sender', 'receiver'],
    });

    const blockedList = await this.friendRepository.find({
      where: {
        receiver: { id: userId },
        status: FriendStatus.Blocked,
      },
      relations: ['sender', 'receiver'],
    });

    return {
      blockList,
      blockedList,
    };
  }

  async blocker(blockerId: number, blockedUserId: number) {
    const blockedUser = await this.friendRepository.findOne({
      where: [
        { sender: { id: blockerId }, receiver: { id: blockedUserId } },
        { sender: { id: blockedUserId }, receiver: { id: blockerId } },
      ],
    });

    if (!blockedUser) {
      const newBlockedUser = this.friendRepository.create({
        sender: { id: blockerId }, // Set the blocker ID
        receiver: { id: blockedUserId },
        status: FriendStatus.Blocked,
      });
      await this.friendRepository.save(newBlockedUser);
    }
  }

  async unblock(friendRequestId: number) {
    await this.friendRepository.update(friendRequestId, {
      status: FriendStatus.Friended,
    });
    const updatedFriendRequest = await this.findOne(friendRequestId);
    const sender = await this.userService.findUsersById(
      updatedFriendRequest.sender.id,
    );
    const receiver = await this.userService.findUsersById(
      updatedFriendRequest.receiver.id,
    );
    this.channelService.unmuteBothUserInBlock(sender.id, receiver.id);
    return updatedFriendRequest;
  }

  async updateRoomId(p1: number, p2: number) {
    let friend = await this.friendRepository.findOne({
      where: {
        sender: { id: p1 },
        receiver: { id: p2 },
      },
    });
    if (friend == undefined) {
      friend = await this.friendRepository.findOne({
        where: {
          sender: { id: p2 },
          receiver: { id: p1 },
        },
      });
    }

    const test = await this.friendRepository.update(friend.id, {
      roomId: 'in game',
    });

    return test;
  }

  async getGameStatus(userId: number) {
    let friend = await this.friendRepository.find({
      where: {
        sender: { id: userId },
        roomId: 'in game',
      },
      relations: ['sender', 'receiver'],
    });
    console.log(friend);
    if (friend == undefined) {
      friend = await this.friendRepository.find({
        where: {
          receiver: { id: userId },
          roomId: 'in game',
        },
        relations: ['sender', 'receiver'],
      });
    }
    return friend;
  }
}
