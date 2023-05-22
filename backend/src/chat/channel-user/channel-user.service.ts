import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelUser } from 'src/typeorm/channel_user.entity';
import { Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';
import { CreateChannelUserDto } from './dto';

@Injectable()
export class ChannelUserService {
	constructor(
		@InjectRepository(ChannelUser) private channelUsersRepository: Repository<ChannelUser>
	) {}

	async getAllChannelUsers() {
		return await this.channelUsersRepository.find();
	}

	async findChannelUserById(channeluser_id: number) {
		return await this.channelUsersRepository.findOne({
			where: { channeluser_uid: channeluser_id }
		});
	}

	async createChannelUser(dto: CreateChannelUserDto, user: User) {
		const newChannelUser = await this.channelUsersRepository.create({
			user: dto.user,
			role: dto.role,
			status: dto.status,
			channel: dto.channel
		});
		return await this.channelUsersRepository.save(newChannelUser);
	}

	async deleteChannelUserById(channeluser_uid: number) {
		return await this.channelUsersRepository.delete({
			channeluser_uid: channeluser_uid
		});
	}

	async deleteAllChannelUsersByChannelId(channel_uid: number) {
		return await this.channelUsersRepository.delete({
			channel: {channel_uid: channel_uid}
		});
	}
}
