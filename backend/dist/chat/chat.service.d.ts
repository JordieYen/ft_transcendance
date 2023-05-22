import { Channel } from 'src/typeorm/channel.entity';
import { ChannelUser } from 'src/typeorm/channel_user.entity';
import { Repository } from 'typeorm';
import { CreateChatDto, JoinChatDto } from './dto';
import { User } from 'src/typeorm/user.entity';
import { UsersService } from 'src/users/services/users.service';
export declare class ChatService {
    private userService;
    private channelsRepository;
    private channelUsersRepository;
    constructor(userService: UsersService, channelsRepository: Repository<Channel>, channelUsersRepository: Repository<ChannelUser>);
    testChannel(currentUser: User): Promise<void>;
    createChannel(dto: CreateChatDto, user: User): Promise<Channel>;
    joinChannel(dto: JoinChatDto, user: User): Promise<ChannelUser>;
    deleteChannel(channelId: number, user: User): Promise<void>;
    listChannelByUser(user: User): void;
    listPublicChannels(): void;
    listProtectedChannels(): void;
    findChannelById(channel_id: number): Promise<Channel>;
    getAllChannels(): Promise<Channel[]>;
}
