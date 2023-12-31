import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelUser } from './channel_user.entity';
import { Friend } from './friends.entity';
import { GameInvitation } from './game_invitation.entity';
import { MatchHistory } from './match_history.entity';
import { Message } from './message.entity';
import { Stat } from './stats.entity';
import { UserAchievement } from './user_achievement.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  intra_uid: number;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({
    default: `${process.env.NEST_HOST}/public/default_avatar.png`,
    nullable: true,
  })
  avatar: string;

  @Column({ default: false })
  online: boolean;

  @Column({ default: false })
  authentication: boolean;

  @Column({ default: null })
  authenticationString: string;

  @Column({ default: true })
  firstTimeLogin: boolean;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => Stat, (stat) => stat.user)
  stat: Stat;

  @OneToMany(() => UserAchievement, (userAchievement) => userAchievement.user)
  userAchievement: UserAchievement[];

  @OneToMany(() => MatchHistory, (matchHistory) => matchHistory.p1)
  p1_match: MatchHistory[];

  @OneToMany(() => MatchHistory, (matchHistory) => matchHistory.p2)
  p2_match: MatchHistory[];

  // @ManyToMany(() => Friend, friend => [friend.sender, friend.receiver])
  // @JoinTable()
  // friends: Friend[];

  @OneToMany(() => Friend, (friend) => friend.sender)
  sentFriendRequest: Friend[];

  @OneToMany(() => Friend, (friend) => friend.receiver)
  receiveFriendRequest: Friend[];

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
  channelMember: ChannelUser[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => GameInvitation, (GameInvitation) => GameInvitation.sender)
  sentGameInvitations: GameInvitation[];

  @OneToMany(() => GameInvitation, (GameInvitation) => GameInvitation.receiver)
  receiveGameInvitations: GameInvitation[];

  @BeforeInsert()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
