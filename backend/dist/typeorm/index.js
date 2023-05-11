"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
const match_history_entity_1 = require("./match_history.entity");
=======
const achievement_entity_1 = require("./achievement.entity");
const channel_entity_1 = require("./channel.entity");
const channel_user_entity_1 = require("./channel_user.entity");
const friends_entity_1 = require("./friends.entity");
const match_history_entity_1 = require("./match_history.entity");
const message_entity_1 = require("./message.entity");
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
const stats_entity_1 = require("./stats.entity");
const user_entity_1 = require("./user.entity");
const entities = [
    user_entity_1.User,
    match_history_entity_1.MatchHistory,
<<<<<<< HEAD
    stats_entity_1.Stat
=======
    stats_entity_1.Stat,
    achievement_entity_1.Achievement,
    friends_entity_1.Friend,
    channel_entity_1.Channel,
    channel_user_entity_1.ChannelUser,
    message_entity_1.Message
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
];
exports.default = entities;
//# sourceMappingURL=index.js.map