import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

export enum Role {
  Owner = 'owner',
  Admin = 'admin',
  User = 'user',
}

export enum Status {
  Null = 'null',
  Banned = 'banned',
  Muted = 'muted',
}

@Entity()
export class ChannelUser {
  @PrimaryGeneratedColumn()
  channeluser_uid: number;

  @ManyToOne(() => User, (user) => user.channelMember)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @Column()
  // userrrr_id: number;

  @Column()
  role: Role;

  @Column()
  status?: Status;

  @Column({ nullable: true })
  mutedUntil: Date;

  @ManyToOne(() => Channel, (channel) => channel.channelUser)
  channel: Channel;

  // channel_id: number;

  @CreateDateColumn()
  joinedAt: Date;
}
