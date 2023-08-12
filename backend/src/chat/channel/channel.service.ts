import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser, Role, Status } from 'src/typeorm/channel_user.entity';
import { ILike, In, Not, Repository } from 'typeorm';
import { CreateChannelDto, JoinChannelDto } from './dto';
import * as argon from 'argon2';
import { User } from 'src/typeorm/user.entity';
import { UsersService } from 'src/users/services/users.service';
import { ChannelUserService } from '../channel-user/channel-user.service';
import { CreateChannelUserDto } from '../channel-user/dto';

@Injectable()
export class ChannelService {
  constructor(
    private userService: UsersService,
    private channelUserService: ChannelUserService,
    @InjectRepository(Channel) private channelsRepository: Repository<Channel>,
    @InjectRepository(ChannelUser)
    private channelUsersRepository: Repository<ChannelUser>,
  ) {}

  async getAllChannels() {
    return await this.channelsRepository.find();
  }

  async findChannelById(channel_id: number) {
    return await this.channelsRepository.findOne({
      where: { channel_uid: channel_id },
    });
  }

  async findChannelsByUserId(user_id: number) {
    return await this.channelsRepository.find({
      where: {
        channelUser: { user: { id: user_id }, status: Status.Null },
      },
    });
  }

  async findChannelsByChannelType(channel_type: string) {
    // console.log('in type');
    return await this.channelsRepository.find({
      where: {
        channel_type: channel_type,
      },
    });
  }

  async findChannelsByChannelTypeWithId(channel_type: string, userId: number) {
    // console.log('in type');
    const channelUsers: ChannelUser[] = await this.channelUsersRepository.find({
      relations: ['channel'],
      where: {
        user: { id: userId },
      },
    });

    const channelIds: number[] = [];

    channelUsers.map((channelUserrr) => {
      channelIds.push(channelUserrr.channel.channel_uid);
    });

    return await this.channelsRepository.find({
      relations: ['channelUser'],
      where: {
        channel_uid: Not(In(channelIds)),
        channel_type: channel_type,
      },
    });
  }

  async findPublicAndProtectedChannels(userId: number) {
    const channelUsers: ChannelUser[] = await this.channelUsersRepository.find({
      relations: ['channel'],
      where: {
        user: { id: userId },
      },
    });

    const channelIds: number[] = [];

    channelUsers.map((channelUserrr) => {
      channelIds.push(channelUserrr.channel.channel_uid);
    });

    return await this.channelsRepository.find({
      relations: ['channelUser'],
      where: {
        channel_uid: Not(In(channelIds)),
        channel_type: In(['public', 'protected']),
      },
    });
  }

  async searchChannels(channel_type: string, name: string, userId: number) {
    const channelUsers: ChannelUser[] = await this.channelUsersRepository.find({
      relations: ['channel'],
      where: {
        user: { id: userId },
      },
    });

    const channelIds: number[] = [];

    channelUsers.map((channelUserrr) => {
      channelIds.push(channelUserrr.channel.channel_uid);
    });

    if (channel_type == 'all') {
      return await this.channelsRepository.find({
        where: {
          channel_uid: Not(In(channelIds)),
          channel_name: ILike('%' + name + '%'),
          channel_type: In(['public', 'protected']),
        },
      });
    }

    return await this.channelsRepository.find({
      where: {
        channel_uid: Not(In(channelIds)),
        channel_name: ILike('%' + name + '%'),
        channel_type: channel_type,
      },
    });
  }

  async searchChannelsGroup(name: string, userId: number) {
    return await this.channelsRepository.find({
      where: {
        channelUser: { user: { id: userId }, status: Status.Null },
        channel_name: ILike('%' + name + '%'),
      },
    });
  }

  async validateChannel(channelId: number, user: User) {
    const test = await this.channelUsersRepository.find({
      relations: ['user', 'channel'],
      where: {
        channel: { channel_uid: channelId },
        user: { id: user.id },
      },
    });
    if (test.length == 0) {
      return false;
    }
    return true;
  }

  async createChannel(dto: CreateChannelDto, user: User) {
    try {
      this.validateUser(user);
      let hash = '';
      // hashing password if channel type provided is protected
      if (dto.channel_type == 'protected') {
        if (dto.channel_hash != '') {
          hash = await argon.hash(dto.channel_hash);
        } else {
          // fix : need updates to exception
          throw new InternalServerErrorException('password is empty');
        }
      }
      // creating new channel
      const newChannel = await this.channelsRepository.create({
        channel_name: dto.channel_name,
        channel_type: dto.channel_type,
        channel_hash: hash,
      });
      const channel = await this.channelsRepository.save(newChannel);
      // creating new channel user
      const createChannelDto: CreateChannelUserDto = {
        user: user,
        role: Role.Owner,
        status: Status.Null,
        channel: channel,
      };
      this.channelUserService.createChannelUser(createChannelDto, user);
      return newChannel;
    } catch (error) {
      console.log('error=', error.message);
      throw new InternalServerErrorException('Channel not created');
    }
  }

  async joinChannel(dto: JoinChannelDto, user: User) {
    try {
      this.validateUser(user);
      //checking if channel id given is valid
      const channel = await this.findChannelById(dto.channel_uid);
      if (!channel) {
        throw new ForbiddenException('Channel not found');
      }
      // checking if user is already in channel
      const existingChannelUser = await this.channelUsersRepository.findOne({
        where: {
          channel: { channel_uid: channel.channel_uid },
          user: { id: user.id },
        },
      });
      if (existingChannelUser) {
        throw new ForbiddenException('User already in channel');
      }
      // check if password is correct if channel type id protected
      if (channel.channel_type == 'protected') {
        if (dto.channel_password == undefined || dto.channel_password == null) {
          throw new ForbiddenException(
            'channel is protected: Channel_password id empty',
          );
        }
        const pwMatches = await argon.verify(
          channel.channel_hash,
          dto.channel_password,
        );
        if (!pwMatches) {
          throw new ForbiddenException('Channel_password incorrect');
        }
      }
      // creating new channel user
      const createChannelDto: CreateChannelUserDto = {
        user: user,
        role: Role.User,
        status: Status.Null,
        channel: channel,
      };
      this.channelUserService.createChannelUser(createChannelDto, user);
    } catch (error) {
      console.log('error=', error.message);
      // throw error;
      // throw new InternalServerErrorException('Channel not found');
    }
  }

  async addUserToChannel(channelId: number, newUserId: number, user: User) {
    try {
      this.validateUser(user);
      const newUser = await this.userService.findUsersById(newUserId);
      //checking if channel id given is valid
      const channel = await this.findChannelById(channelId);
      if (!channel) {
        throw new ForbiddenException('Channel not found');
      }
      // checking if user is already in channel
      const existingChannelUser = await this.channelUsersRepository.findOne({
        where: {
          channel: { channel_uid: channel.channel_uid },
          user: { id: newUserId },
        },
      });
      if (existingChannelUser) {
        throw new ForbiddenException('User already in channel');
      }
      // creating new channel user
      const createChannelDto: CreateChannelUserDto = {
        user: newUser,
        role: Role.User,
        status: Status.Null,
        channel: channel,
      };
      this.channelUserService.createChannelUser(createChannelDto, newUser);
    } catch (error) {
      console.log('error=', error.message);
      // throw error;
      // throw new InternalServerErrorException('Channel not found');
    }
  }

  async leaveChannel(dto: JoinChannelDto, user: User) {
    try {
      this.validateUser(user);
      //checking if channel id given is valid
      const channel = await this.findChannelById(dto.channel_uid);
      if (!channel) {
        throw new ForbiddenException('Channel not found');
      }
      // checking if user is already in channel
      const existingChannelUser = await this.channelUsersRepository.findOne({
        where: {
          channel: { channel_uid: channel.channel_uid },
          user: { id: user.id },
        },
      });
      if (!existingChannelUser) {
        throw new ForbiddenException('User not in channel');
      }
      // deleteting channel user
      this.channelUserService.deleteAllChannelUserByChannelIdAndUserId(
        channel.channel_uid,
        user.id,
      );
    } catch (error) {
      console.log('error=', error.message);
      // throw error;
      // throw new InternalServerErrorException('Channel not found');
    }
  }

  async changeChannelPassword(
    channelId: number,
    oldPassword: string,
    newPassword: string,
    user: User,
  ) {
    this.validateUser(user);
    const channel = await this.findChannelById(channelId);
    const channelUser =
      await this.channelUserService.findChannelUserByChannelIdAndUserId(
        channelId,
        user.id,
      );

    if (channelUser.role == 'owner') {
      const pwMatches = await argon.verify(channel.channel_hash, oldPassword);

      if (!pwMatches) {
        console.log('Password Mismatch');
      } else {
        console.log('Password Matches');
        if (newPassword != '') {
          console.log('Password changed');
          const channel_hash = await argon.hash(newPassword);
          await this.channelsRepository.save({
            channel_uid: channelId,
            channel_hash,
          });
        }
      }
    }
  }

  async changeChannelType(
    channelId: number,
    newChanneltype: string,
    newPassword: string,
    user: User,
  ) {
    this.validateUser(user);
    const channel = await this.findChannelById(channelId);
    console.log(channel);

    const channelUser =
      await this.channelUserService.findChannelUserByChannelIdAndUserId(
        channelId,
        user.id,
      );

    if (channelUser.role == 'owner') {
      if (newChanneltype == 'protected') {
        const channel_hash = await argon.hash(newPassword);
        const channel_type = newChanneltype;
        await this.channelsRepository.save({
          channel_uid: channelId,
          channel_type,
          channel_hash,
        });
      } else {
        const channel_type = newChanneltype;
        const channel_hash = '';
        await this.channelsRepository.save({
          channel_uid: channelId,
          channel_type,
          channel_hash,
        });
      }
    }

    // if (channelUser.role == 'owner') {
    //   this.channelsRepository.save({
    //     channel_uid: channelId,
    //     channel_type: newChanneltype,
    //   });
    // }
  }

  async deleteChannel(channelId: number, user: User) {
    try {
      this.validateUser(user);
      //checking if channel id given is valid
      const channel = await this.channelsRepository.findOne({
        where: {
          channel_uid: channelId,
        },
      });
      if (!channel) {
        throw new ForbiddenException('Channel not found');
      }
      // checking if user is already in channel
      const channelOwner = await this.channelUsersRepository.findOne({
        where: {
          channel: { channel_uid: channelId },
          user: { id: user.id },
        },
      });
      if (!channelOwner) {
        throw new ForbiddenException('User not in channel');
      }
      // checking if user is owner of channel
      if (channelOwner.role != Role.Owner && channelOwner.role != Role.Admin) {
        throw new ForbiddenException('User is not owner');
      }
      this.channelUserService.deleteAllChannelUsersByChannelId(
        channel.channel_uid,
      );
      this.channelsRepository.delete({
        channel_uid: channel.channel_uid,
      });
    } catch (error) {
      console.log('error=', error.message);
      // throw error;
    }
  }

  validateUser(user: User) {
    //checking if user is valid
    if (!user) throw new ForbiddenException('User not found');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  async testChannel(_currentUser: User) {}
}
