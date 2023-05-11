import { Achievement } from "./achievement.entity";
import { Channel } from "./channel.entity";
import { ChannelUser } from "./channel_user.entity";
import { Friend } from "./friends.entity";
import { MatchHistory } from "./match_history.entity";
<<<<<<< HEAD
import { Stat } from "./stats.entity";
import { User } from "./user.entity";
declare const entities: (typeof MatchHistory | typeof User | typeof Stat)[];
=======
import { Message } from "./message.entity";
import { Stat } from "./stats.entity";
import { User } from "./user.entity";
declare const entities: (typeof Message | typeof Channel | typeof User | typeof ChannelUser | typeof Friend | typeof MatchHistory | typeof Stat | typeof Achievement)[];
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
export default entities;
