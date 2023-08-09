import { Achievement } from './achievement.entity';
import { Channel } from './channel.entity';
import { ChannelUser } from './channel_user.entity';
import { Friend } from './friends.entity';
import { GameInvitation } from './game_invitation.entity';
import { MatchHistory } from './match_history.entity';
import { Message } from './message.entity';
import { Stat } from './stats.entity';
import { User } from './user.entity';
import { UserAchievement } from './user_achievement.entity';

const entities = [
  User,
  MatchHistory,
  Stat,
  UserAchievement,
  Achievement,
  Friend,
  Channel,
  ChannelUser,
  Message,
  GameInvitation,
  // SessionEntity
];

export default entities;
