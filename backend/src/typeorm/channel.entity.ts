import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { ChannelUser } from "./channel_user.entity";
import { Message } from "./message.entity";

enum ChannelType {
    Public = 'public',
    Private = 'private',
    Protected = 'protected',
    Direct = 'direct',
}

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    channel_uid: string;

    @Column()
    channel_name: string;

    @Column()
    channel_type: ChannelType;

    @Column()
    channel_hash: string;

    @OneToMany( () => ChannelUser, channelUser => channelUser.channel)
    channelUser: ChannelUser[];

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @BeforeInsert()
    hashPassword() {
        if (this.channel_type === ChannelType.Private || this.channel_type === ChannelType.Protected)
            this.channel_hash = bcrypt.hashSync(this.channel_hash, 10);
    }

    @OneToMany( () => Message, message => message.channel)
    messages: Message[];
}
