import { ChatService } from './chat.service';
import { CreateChatDto, JoinChatDto } from './dto';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    testChannel(user: any): Promise<void>;
    createChannel(dto: CreateChatDto, user: any): Promise<import("../typeorm/channel.entity").Channel>;
    joinChannel(dto: JoinChatDto, user: any): Promise<import("../typeorm/channel_user.entity").ChannelUser>;
    deleteChannel(channel_uid: number, user: any): Promise<void>;
    listChannelByUser(user: any): void;
    listPublicChannels(): void;
    listProtectedChannels(): void;
    findChannelById(channel_id: number): Promise<import("../typeorm/channel.entity").Channel>;
    getAllChannels(): Promise<import("../typeorm/channel.entity").Channel[]>;
}
