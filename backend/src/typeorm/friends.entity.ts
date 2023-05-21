import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum FriendStatus {
    Invited = 'invited',
    Pending = 'pending',
    Friended = 'friended',
    Blocked = 'blocked',
}

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user1: User;

    @ManyToOne(() => User)
    user2: User;

    @Column({ type: 'enum', enum: FriendStatus})
    status: FriendStatus;
}
