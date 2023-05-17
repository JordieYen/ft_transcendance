import { ChannelUser } from "./channel_user.entity";
import { Message } from "./message.entity";
export declare class Channel {
    channel_uid: number;
    channel_name: string;
    channel_type: string;
    channel_hash: string;
    channelUser: ChannelUser[];
    createdAt: Date;
    messages: Message[];
}
