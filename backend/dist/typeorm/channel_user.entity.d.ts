import { Channel } from "./channel.entity";
import { User } from "./user.entity";
export declare enum Role {
    Owner = "owner",
    Admin = "admin",
    User = "user"
}
export declare enum Status {
    Null = "null",
    Banned = "banned",
    Muted = "muted"
}
export declare class ChannelUser {
    channeluser_uid: number;
    user: User;
    role: Role;
    status?: Status;
    mutedUntil: Date;
    channel: Channel;
    joinedAt: Date;
}
