import { User } from "./user.entity";
export declare enum FriendStatus {
    Invited = "invited",
    Pending = "pending",
    Friended = "friended",
    Blocked = "blocked"
}
export declare class Friend {
    id: number;
    sender: User;
    receiver: User;
    status: FriendStatus;
}
