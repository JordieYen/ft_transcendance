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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const achievement_entity_1 = require("./achievement.entity");
const channel_user_entity_1 = require("./channel_user.entity");
const friends_entity_1 = require("./friends.entity");
const match_history_entity_1 = require("./match_history.entity");
const Message_entity_1 = require("./Message.entity");
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
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: true }),
    __metadata("design:type", String)
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
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
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
    (0, typeorm_1.OneToMany)(() => Message_entity_1.Message, message => message.sender),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map