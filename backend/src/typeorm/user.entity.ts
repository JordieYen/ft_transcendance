import { BeforeInsert, Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Achievement } from './achievement.entity';
import { ChannelUser } from './channel_user.entity';
import { Friend } from './friends.entity';
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

    @Column({ default: 'default_avatar.png'})
    avatar: string;

    @Column({ default: false })
    online: boolean;

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

    @OneToOne(() => Stat, stat => stat.user)
    stat: Stat;

    @OneToMany(() => UserAchievement, userAchievement => userAchievement.user)
    userAchievement: UserAchievement[];

    @OneToMany(() => MatchHistory, matchHistory => matchHistory.p1_uid)
    p1_match: MatchHistory[];

    @OneToMany(() => MatchHistory, matchHistory => matchHistory.p2_uid)
    p2_match: MatchHistory[];

    @ManyToMany(() => Friend, friend => [friend.sender, friend.receiver])
    friends: Friend[];

    // @OneToMany(() => Friend, friend => friend.sender)
    // sentFriendRequest: Friend[];

    // @OneToMany(() => Friend, friend => friend.receiver)
    // receiveFriendRequest: Friend[];

    @OneToMany(() => ChannelUser, channelUser => channelUser.user)
    channelMember: ChannelUser[];

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    @BeforeInsert()
    updateUpdatedAt() {
        this.updatedAt = new Date();
    }

}
