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
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
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
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
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