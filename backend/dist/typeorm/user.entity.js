"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
<<<<<<< HEAD:backend/dist/typeorm/user.entity.js
exports.User = void 0;
const typeorm_1 = require("typeorm");
=======
exports.User = void 0;
const typeorm_1 = require("typeorm");
const achievement_entity_1 = require("./achievement.entity");
const channel_user_entity_1 = require("./channel_user.entity");
const friends_entity_1 = require("./friends.entity");
const match_history_entity_1 = require("./match_history.entity");
const message_entity_1 = require("./message.entity");
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
const stats_entity_1 = require("./stats.entity");
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", Number)
], User.prototype, "intra_uid", void 0);
<<<<<<< HEAD
=======
exports.Channel = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = require("bcrypt");
const channel_user_entity_1 = require("./channel_user.entity");
const message_entity_1 = require("./message.entity");
var ChannelType;
(function (ChannelType) {
    ChannelType["Public"] = "public";
    ChannelType["Private"] = "private";
    ChannelType["Protected"] = "protected";
    ChannelType["Direct"] = "direct";
})(ChannelType || (ChannelType = {}));
let Channel = class Channel {
    hashPassword() {
        if (this.channel_type === ChannelType.Private || this.channel_type === ChannelType.Protected)
            this.channel_hash = bcrypt.hashSync(this.channel_hash, 10);
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", String)
], Channel.prototype, "channel_uid", void 0);
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671:backend/dist/typeorm/channel.entity.js
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
<<<<<<< HEAD:backend/dist/typeorm/user.entity.js
=======
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'default_avatar.png' }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "online", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
<<<<<<< HEAD
=======
], Channel.prototype, "channel_name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "channel_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Channel.prototype, "channel_hash", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_user_entity_1.ChannelUser, channelUser => channelUser.channel),
    __metadata("design:type", Array)
], Channel.prototype, "channelUser", void 0);
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671:backend/dist/typeorm/channel.entity.js
=======
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
<<<<<<< HEAD
    }),
    __metadata("design:type", Date)
<<<<<<< HEAD:backend/dist/typeorm/user.entity.js
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => stats_entity_1.Stat),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", stats_entity_1.Stat)
], User.prototype, "stat", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map
=======
], Channel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Channel.prototype, "hashPassword", null);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, message => message.channel),
    __metadata("design:type", Array)
], Channel.prototype, "messages", void 0);
Channel = __decorate([
    (0, typeorm_1.Entity)()
], Channel);
exports.Channel = Channel;
//# sourceMappingURL=channel.entity.js.map
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671:backend/dist/typeorm/channel.entity.js
=======
        onUpdate: 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => stats_entity_1.Stat),
    __metadata("design:type", stats_entity_1.Stat)
], User.prototype, "stat", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => achievement_entity_1.Achievement, achievement => achievement.user),
    __metadata("design:type", achievement_entity_1.Achievement)
], User.prototype, "achievement", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_history_entity_1.MatchHistory, matchHistory => matchHistory.p1_uid),
    __metadata("design:type", Array)
], User.prototype, "p1_match", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_history_entity_1.MatchHistory, matchHistory => matchHistory.p2_uid),
    __metadata("design:type", Array)
], User.prototype, "p2_match", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => friends_entity_1.Friend, friend => [friend.user1, friend.user2]),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => channel_user_entity_1.ChannelUser, channelUser => channelUser.user),
    __metadata("design:type", Array)
], User.prototype, "channelMember", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, message => message.sender),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
