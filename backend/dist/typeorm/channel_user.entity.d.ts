import { Channel } from "./channel.entity";
import { User } from "./user.entity";
declare enum Role {
    Owner = "owner",
    Admin = "admin",
    User = "user"
}
declare enum Status {
    Null = "null",
    Banned = "banned",
    Muted = "muted"
}
export declare class ChannelUser {
    channel_uid: number;
    user: User;
    role: Role;
    status: Status;
    mutedUntil: Date;
    channel: Channel;
    joinedAt: Date;
}
export {};
