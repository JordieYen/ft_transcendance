<<<<<<< HEAD
=======
import { Achievement } from './achievement.entity';
import { ChannelUser } from './channel_user.entity';
import { Friend } from './friends.entity';
import { MatchHistory } from './match_history.entity';
import { Message } from './message.entity';
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
import { Stat } from './stats.entity';
export declare class User {
    id: number;
    intra_uid: number;
    username: string;
    avatar: string;
    online: boolean;
    createdAt: Date;
    updatedAt: Date;
    stat: Stat;
<<<<<<< HEAD
=======
    achievement: Achievement;
    p1_match: MatchHistory[];
    p2_match: MatchHistory[];
    friends: Friend[];
    channelMember: ChannelUser[];
    messages: Message[];
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
}
