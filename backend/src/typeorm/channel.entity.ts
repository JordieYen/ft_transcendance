import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ChannelUser } from './channel_user.entity';
import { Message } from './message.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

enum ChannelType {
  Public = 'public',
  Private = 'private',
  Protected = 'protected',
  Direct = 'direct',
}

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  channel_uid: number;

  @Column()
  @IsNotEmpty()
  channel_name: string;

  @Column()
  @IsNotEmpty()
  // channel_type: ChannelType;
  channel_type: string;

  @Column()
  @IsOptional()
  channel_hash: string;

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.channel)
  channelUser: ChannelUser[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  // @BeforeInsert()
  // hashPassword() {
  //     if (this.channel_type === ChannelType.Private || this.channel_type === ChannelType.Protected)
  //         this.channel_hash = bcrypt.hashSync(this.channel_hash, 10);
  // }

  @OneToMany(() => Message, (message) => message.channel, {
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
