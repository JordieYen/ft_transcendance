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
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const channel_user_entity_1 = require("./channel_user.entity");
const friends_entity_1 = require("./friends.entity");
const match_history_entity_1 = require("./match_history.entity");
const message_entity_1 = require("./message.entity");
const stats_entity_1 = require("./stats.entity");
const user_achievement_entity_1 = require("./user_achievement.entity");
let User = class User {
    updateUpdatedAt() {
        this.updatedAt = new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, intra_uid: { required: true, type: () => Number }, username: { required: true, type: () => String }, avatar: { required: true, type: () => String }, online: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, stat: { required: true, type: () => require("./stats.entity").Stat }, userAchievement: { required: true, type: () => [require("./user_achievement.entity").UserAchievement] }, p1_match: { required: true, type: () => [require("./match_history.entity").MatchHistory] }, p2_match: { required: true, type: () => [require("./match_history.entity").MatchHistory] }, friends: { required: true, type: () => [require("./friends.entity").Friend] }, channelMember: { required: true, type: () => [require("./channel_user.entity").ChannelUser] }, messages: { required: true, type: () => [require("./message.entity").Message] } };
    }
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
    (0, typeorm_1.OneToOne)(() => stats_entity_1.Stat, stat => stat.user),
    __metadata("design:type", stats_entity_1.Stat)
], User.prototype, "stat", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_achievement_entity_1.UserAchievement, userAchievement => userAchievement.user),
    __metadata("design:type", Array)
], User.prototype, "userAchievement", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_history_entity_1.MatchHistory, matchHistory => matchHistory.p1_uid),
    __metadata("design:type", Array)
], User.prototype, "p1_match", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_history_entity_1.MatchHistory, matchHistory => matchHistory.p2_uid),
    __metadata("design:type", Array)
], User.prototype, "p2_match", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => friends_entity_1.Friend, friend => [friend.sender, friend.receiver]),
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
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "updateUpdatedAt", null);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map