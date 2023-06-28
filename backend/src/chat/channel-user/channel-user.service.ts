import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUser, Role, Status } from 'src/typeorm/channel_user.entity';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';
import { CreateChannelUserDto } from './dto';

@Injectable()
export class ChannelUserService {
  constructor(
    @InjectRepository(ChannelUser)
    private channelUsersRepository: Repository<ChannelUser>,
  ) {}

  async getAllChannelUsers() {
    return await this.channelUsersRepository.find();
  }

  async findChannelUserById(channeluser_id: number) {
    return await this.channelUsersRepository.findOne({
      where: { channeluser_uid: channeluser_id },
    });
  }

  async findChannelUsersByUserId(user_id: number) {
    return await this.channelUsersRepository.find({
      where: {
        user: { id: user_id },
      },
    });
  }

  async findChannelUsersByChannelId(channel_id: number) {
    return await this.channelUsersRepository.find({
      relations: ['user', 'channel'],
      where: {
        channel: { channel_uid: channel_id },
      },
    });
  }

  async findChannelUserByChannelIdAndUserId(
    channel_id: number,
    user_id: number,
  ) {
    return await this.channelUsersRepository.findOne({
      relations: ['user', 'channel'],
      where: {
        channel: { channel_uid: channel_id },
        user: { id: user_id },
      },
    });
  }

  async getRoleOfUserByUserIdAndChannelId(user_id: number, channel_id: number) {
    const channel_user = await this.channelUsersRepository.findOne({
      where: {
        user: { id: user_id },
        channel: { channel_uid: channel_id },
      },
    });
    console.log(user_id, channel_id, channel_user);
    return channel_user.role;
  }

  async getMutedOfUserByUserIdAndChannelId(
    user_id: number,
    channel_id: number,
  ) {
    const channel_user = await this.channelUsersRepository.findOne({
      where: {
        user: { id: user_id },
        channel: { channel_uid: channel_id },
      },
    });
    return channel_user.mutedUntil;
  }

  async updateMuteUserByUserIdAndChannelId(
    user_id: number,
    channel_id: number,
    muted_days: number,
    user: User,
  ) {
    try {
      if (!user) throw new ForbiddenException('Not logged in');
      const channelOwner = await this.findChannelUserByChannelIdAndUserId(
        channel_id,
        user.id,
      );
      if (!channelOwner) {
        throw new ForbiddenException('User not in channel');
      }
      if (channelOwner.role != Role.Owner && channelOwner.role != Role.Admin) {
        throw new ForbiddenException('User is not owner');
      }
      const channelUser = await this.findChannelUserByChannelIdAndUserId(
        channel_id,
        user_id,
      );
      if (!channelUser) {
        throw new ForbiddenException('User to be updated not in channel');
      }
      let date = new Date();
      date.setDate(date.getDate() + muted_days);
      if (muted_days == 0) date = null;
      return await this.channelUsersRepository.update(
        channelUser.channeluser_uid,
        {
          mutedUntil: date,
        },
      );
    } catch (error) {
      console.log('error=', error.message);
      throw error;
    }
  }

  async unmuteUserByUserIdAndChannelId(user_id: number, channel_id: number) {
    try {
      const channelUser = await this.findChannelUserByChannelIdAndUserId(
        channel_id,
        user_id,
      );
      if (!channelUser) {
        throw new ForbiddenException('User to be updated not in channel');
      }
      const current_date = new Date();
      const date = new Date(channelUser.mutedUntil);
      if (current_date > date) {
        return await this.channelUsersRepository.update(
          channelUser.channeluser_uid,
          {
            mutedUntil: null,
          },
        );
      }
    } catch (error) {
      console.log('error=', error.message);
      throw error;
    }
  }

  async createChannelUser(dto: CreateChannelUserDto, user: User) {
    const newChannelUser = await this.channelUsersRepository.create({
      user: dto.user,
      role: dto.role,
      status: dto.status,
      channel: dto.channel,
    });
    return await this.channelUsersRepository.save(newChannelUser);
  }

  async updateStatus(
    status: string,
    user_id: number,
    channel_id: number,
    user: User,
  ) {
    try {
      if (
        status === Status.Null ||
        status === Status.Muted ||
        status === Status.Banned
      ) {
        const newStatus: Status = status;
        if (!user) throw new ForbiddenException('Not logged in');
        const channelOwner = await this.findChannelUserByChannelIdAndUserId(
          channel_id,
          user.id,
        );
        if (!channelOwner) {
          throw new ForbiddenException('User not in channel');
        }
        console.log('channel owner', channelOwner);
        if (
          channelOwner.role != Role.Owner &&
          channelOwner.role != Role.Admin
        ) {
          throw new ForbiddenException('User is not owner');
        }
        const channelUser = await this.findChannelUserByChannelIdAndUserId(
          channel_id,
          user_id,
        );
        if (!channelUser) {
          throw new ForbiddenException('User to be updated not in channel');
        }
        console.log('channel user', channelUser);
        return await this.channelUsersRepository.update(
          channelUser.channeluser_uid,
          {
            status: status,
          },
        );
      } else {
        throw new ForbiddenException(
          'Input Valid Status, {null, banned, muted}',
        );
      }
    } catch (error) {
      console.log('error=', error.message);
      throw error;
    }
  }

  async updateRole(
    role: string,
    user_id: number,
    channel_id: number,
    user: User,
  ) {
    try {
      if (role === Role.Admin || role === Role.Owner || role === Role.User) {
        if (!user) throw new ForbiddenException('Not logged in');
        const channelOwner = await this.findChannelUserByChannelIdAndUserId(
          channel_id,
          user.id,
        );
        if (!channelOwner) {
          throw new ForbiddenException('User not in channel');
        }
        console.log('channel owner', channelOwner);
        if (
          channelOwner.role != Role.Owner &&
          channelOwner.role != Role.Admin
        ) {
          throw new ForbiddenException('User is not owner');
        }
        const channelUser = await this.findChannelUserByChannelIdAndUserId(
          channel_id,
          user_id,
        );
        if (!channelUser) {
          throw new ForbiddenException('User to be updated not in channel');
        }
        console.log('channel user', channelUser);
        return await this.channelUsersRepository.update(
          channelUser.channeluser_uid,
          {
            role: role,
          },
        );
      } else {
        throw new ForbiddenException('Input Valid Role, {null, banned, muted}');
      }
    } catch (error) {
      console.log('error=', error.message);
      throw error;
    }
  }

  async deleteChannelUserById(channeluser_uid: number) {
    return await this.channelUsersRepository.delete({
      channeluser_uid: channeluser_uid,
    });
  }

  async deleteAllChannelUsersByChannelId(channel_uid: number) {
    return await this.channelUsersRepository.delete({
      channel: { channel_uid: channel_uid },
    });
  }

  async deleteAllChannelUserByChannelIdAndUserId(
    channel_uid: number,
    user_id: number,
  ) {
    return await this.channelUsersRepository.delete({
      channel: { channel_uid: channel_uid },
      user: { id: user_id },
    });
  }

  async test(test: number) {
    const date = new Date();
    console.log('1', date);
    // const n = 1;
    date.setDate(date.getDate() + test);
    console.log('2', date);
    // date.setDate(date.getDate() + n);
    console.log('3', date);
  }
}
