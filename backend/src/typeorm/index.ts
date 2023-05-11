import { Achievement } from "./achievement.entity";
import { Channel } from "./channel.entity";
import { ChannelUser } from "./channel_user.entity";
import { Friend } from "./friends.entity";
import { MatchHistory } from "./match_history.entity";
import { Message } from "./message.entity";
import { Stat } from "./stats.entity";
import { User } from "./user.entity";

const entities = [
    User, 
    MatchHistory,
    Stat,
    Achievement,
    Friend,
    Channel,
    ChannelUser,
    Message
];

// export {Users, MatchHistory};
export default entities;
