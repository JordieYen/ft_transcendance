import { User } from "./user.entity";
export declare enum FriendStatus {
    Invited = "invited",
    Pending = "pending",
    Friended = "friended",
    Blocked = "blocked",
    Decline = "decline",
    Cancel = "cancel"
}
export declare class Friend {
    id: number;
    '': any;
    sender: User;
    receiver: User;
    status: FriendStatus;
}
