import { ChannelUser } from "./channel_user.entity";
import { Message } from "./message.entity";
declare enum ChannelType {
    Public = "public",
    Private = "private",
    Protected = "protected",
    Direct = "direct"
}
export declare class Channel {
    channel_uid: string;
    channel_name: string;
    channel_type: ChannelType;
    channel_hash: string;
    channelUser: ChannelUser[];
    createdAt: Date;
    hashPassword(): void;
    messages: Message[];
}
export {};
