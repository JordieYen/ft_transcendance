import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser } from 'src/typeorm/channel_user.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto';
export declare class ChatService {
    private channelsRepository;
    private channelUsersRepository;
    constructor(channelsRepository: Repository<Channel>, channelUsersRepository: Repository<ChannelUser>);
    createChannel(dto: CreateChatDto): Promise<Channel>;
    enterChannel(): Promise<void>;
}
