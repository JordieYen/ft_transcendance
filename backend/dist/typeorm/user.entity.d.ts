import { ChannelUser } from './channel_user.entity';
import { Friend } from './friends.entity';
import { MatchHistory } from './match_history.entity';
import { Message } from './message.entity';
import { Stat } from './stats.entity';
import { UserAchievement } from './user_achievement.entity';
export declare class User {
    id: number;
    intra_uid: number;
    username: string;
    avatar: string;
    online: boolean;
    createdAt: Date;
    updatedAt: Date;
    stat: Stat;
    userAchievement: UserAchievement[];
    p1_match: MatchHistory[];
    p2_match: MatchHistory[];
    friends: Friend[];
    channelMember: ChannelUser[];
    messages: Message[];
    updateUpdatedAt(): void;
}
