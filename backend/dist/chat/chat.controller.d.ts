import { ChatService } from './chat.service';
import { CreateChatDto } from './dto';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    createChannel(dto: CreateChatDto): Promise<import("../typeorm/channel.entity").Channel>;
    enterChat(): Promise<void>;
}
