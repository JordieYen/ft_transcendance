import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser, Role, Status } from 'src/typeorm/channel_user.entity';
import { Repository } from 'typeorm';
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
        channelUser: { user: { id: user_id } },
      },
    });
  }

  async findChannelsByChannelType(channel_type: string) {
    console.log('in type');
    return await this.channelsRepository.findOne({
      where: { channel_type: channel_type },
    });
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
            'hannel is protedted: Channel_password id empty',
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
      throw error;
      throw new InternalServerErrorException('Channel not found');
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
      throw error;
      throw new InternalServerErrorException('Channel not found');
    }
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
      throw error;
    }
  }

  validateUser(user: User) {
    //checking if user is valid
    if (!user) throw new ForbiddenException('User not found');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  async testChannel(_currentUser: User) {}
}
