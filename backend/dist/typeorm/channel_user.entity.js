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
exports.ChannelUser = exports.Status = exports.Role = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const channel_entity_1 = require("./channel.entity");
const user_entity_1 = require("./user.entity");
var Role;
(function (Role) {
    Role["Owner"] = "owner";
    Role["Admin"] = "admin";
    Role["User"] = "user";
})(Role = exports.Role || (exports.Role = {}));
var Status;
(function (Status) {
    Status["Null"] = "null";
    Status["Banned"] = "banned";
    Status["Muted"] = "muted";
})(Status = exports.Status || (exports.Status = {}));
let ChannelUser = class ChannelUser {
    static _OPENAPI_METADATA_FACTORY() {
        return { channeluser_uid: { required: true, type: () => Number }, user: { required: true, type: () => require("./user.entity").User }, role: { required: true, enum: require("./channel_user.entity").Role }, status: { required: false, enum: require("./channel_user.entity").Status }, mutedUntil: { required: true, type: () => Date }, channel: { required: true, type: () => require("./channel.entity").Channel }, joinedAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ChannelUser.prototype, "channeluser_uid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.channelMember),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ChannelUser.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelUser.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChannelUser.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], ChannelUser.prototype, "mutedUntil", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => channel_entity_1.Channel, channel => channel.channelUser),
    __metadata("design:type", channel_entity_1.Channel)
], ChannelUser.prototype, "channel", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChannelUser.prototype, "joinedAt", void 0);
ChannelUser = __decorate([
    (0, typeorm_1.Entity)()
], ChannelUser);
exports.ChannelUser = ChannelUser;
//# sourceMappingURL=channel_user.entity.js.map