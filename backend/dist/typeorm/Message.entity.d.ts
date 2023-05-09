import { Channel } from "./channel.entity";
import { User } from "./user.entity";
export declare class Message {
    id: number;
    channel: Channel;
    sender: User;
    message_content: string;
    message_type: string;
    createdAt: Date;
}
