import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser } from 'src/typeorm/channel_user.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto';
import * as argon from 'argon2';
import { bufferWhen } from 'rxjs';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Channel) private channelsRepository: Repository<Channel>,
		@InjectRepository(ChannelUser) private channelUsersRepository: Repository<ChannelUser>
	) {}

	async createChannel(dto: CreateChatDto) {
		try {
			const newChannel = await this.channelsRepository.create({
				channel_name: dto.channel_name,
				channel_type: dto.channel_type,
				channel_hash: dto.channel_hash
			});
			console.log(newChannel);
			await this.channelsRepository.save(newChannel);
			return newChannel;
		} catch (error) {
			console.log('error=', error.message);
			throw new InternalServerErrorException('Channel not created');
		}
	}

	async enterChannel() {}
}
