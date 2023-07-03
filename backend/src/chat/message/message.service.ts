import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/typeorm/message.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { ChannelUserService } from '../channel-user/channel-user.service';
import { ChannelService } from '../channel/channel.service';
import { User } from 'src/typeorm/user.entity';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessageService {
  constructor(
    private userService: UsersService,
    private channelUserService: ChannelUserService,
    private channelService: ChannelService,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async getAllMessages() {
    return await this.messageRepository.find({
      relations: ['sender'],
    });
  }

  async findMessagesById(channel_id: number) {
    return await this.messageRepository.find({
      relations: ['sender'],
      where: { channel: { channel_uid: channel_id } },
    });
  }

  async createMessage(dto: CreateMessageDto, sender: User) {
    try {
      this.channelService.validateUser(sender);
      // sender = await this.userService.findUsersById(1);
      const channel = await this.channelService.findChannelById(dto.channel_id);
      if (!channel) throw new ForbiddenException('channel not found');
      console.log(channel);
      const channelUser =
        await this.channelUserService.findChannelUserByChannelIdAndUserId(
          channel.channel_uid,
          sender.id,
        );
      if (!channelUser) throw new ForbiddenException('user not in channel');
      const newMessage = await this.messageRepository.create({
        message_content: dto.message_content,
        message_type: dto.message_type,
        sender: sender,
        channel: channel,
      });
      return await this.messageRepository.save(newMessage);
    } catch (error) {
      console.log('error=', error.message);
      throw error;
    }
  }

  test() {
    console.log('test');
    return 'test';
  }
}
