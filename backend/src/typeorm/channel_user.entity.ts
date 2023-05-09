import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "./channel.entity";
import { User } from "./user.entity";


enum Role {
    Owner = 'owner',
    Admin = 'admin',
    User = 'user',
}

enum Status {
    Null = 'null',
    Banned = 'banned',
    Muted ='muted',
}
@Entity()
export class ChannelUser {
    @PrimaryGeneratedColumn()
    channel_uid: number;

    @ManyToOne(() => User, user => user.channelMember)
    @JoinColumn({ name: 'user_id'})
    user: User;

    @Column()
    role: Role;

    @Column()
    status: Status;

    @Column({ nullable: true })
    mutedUntil: Date;

    @ManyToOne(() => Channel, channel => channel.channelUser)
    channel: Channel;

    @CreateDateColumn()
    joinedAt: Date;

}
