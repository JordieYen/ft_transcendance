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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const channel_entity_1 = require("../typeorm/channel.entity");
const channel_user_entity_1 = require("../typeorm/channel_user.entity");
const typeorm_2 = require("typeorm");
const argon = require("argon2");
const users_service_1 = require("../users/services/users.service");
let ChatService = class ChatService {
    constructor(userService, channelsRepository, channelUsersRepository) {
        this.userService = userService;
        this.channelsRepository = channelsRepository;
        this.channelUsersRepository = channelUsersRepository;
    }
    async testChannel(currentUser) {
    }
    async createChannel(dto, user) {
        try {
            if (!user)
                throw new common_1.ForbiddenException('User not found');
            let hash = '';
            if (dto.channel_type == 'protected') {
                if (dto.channel_hash != '') {
                    hash = await argon.hash(dto.channel_hash);
                }
                else {
                    throw new common_1.InternalServerErrorException('password is empty');
                }
            }
            const newChannel = await this.channelsRepository.create({
                channel_name: dto.channel_name,
                channel_type: dto.channel_type,
                channel_hash: hash,
            });
            const channel = await this.channelsRepository.save(newChannel);
            const newChannelUser = await this.channelUsersRepository.create({
                user: user,
                role: channel_user_entity_1.Role.Owner,
                status: channel_user_entity_1.Status.Null,
                channel: channel
            });
            await this.channelUsersRepository.save(newChannelUser);
            return newChannel;
        }
        catch (error) {
            console.log('error=', error.message);
            throw new common_1.InternalServerErrorException('Channel not created');
        }
    }
    async joinChannel(dto, user) {
        try {
            user = await this.userService.findUsersById(15);
            console.log(user);
            if (!user)
                throw new common_1.ForbiddenException('User not found');
            const channel = await this.channelsRepository.findOne({
                where: {
                    channel_uid: dto.channel_uid
                }
            });
            if (!channel) {
                throw new common_1.ForbiddenException('Channel not found');
            }
            const existingChannelUser = await this.channelUsersRepository.findOne({
                where: {
                    channel: { channel_uid: channel.channel_uid },
                    user: { id: user.id }
                }
            });
            if (existingChannelUser) {
                throw new common_1.ForbiddenException('User already in channel');
            }
            if (channel.channel_type == "protected") {
                if (dto.channel_password == undefined || dto.channel_password == null) {
                    throw new common_1.ForbiddenException('hannel is protedted: Channel_password id empty');
                }
                const pwMatches = await argon.verify(channel.channel_hash, dto.channel_password);
                if (!pwMatches) {
                    throw new common_1.ForbiddenException('Channel_password incorrect');
                }
            }
            const newChannelUser = await this.channelUsersRepository.create({
                user: user,
                role: channel_user_entity_1.Role.User,
                status: channel_user_entity_1.Status.Null,
                channel: channel
            });
            await this.channelUsersRepository.save(newChannelUser);
            return newChannelUser;
        }
        catch (error) {
            console.log('error=', error.message);
            throw error;
            throw new common_1.InternalServerErrorException('Channel not found');
        }
    }
    async deleteChannel(channelId, user) {
        try {
            if (!user)
                throw new common_1.ForbiddenException('User not found');
            const channel = await this.channelsRepository.findOne({
                where: {
                    channel_uid: channelId
                }
            });
            if (!channel) {
                throw new common_1.ForbiddenException('Channel not found');
            }
            const channelOwner = await this.channelUsersRepository.findOne({
                where: {
                    channel: { channel_uid: channelId },
                    user: { id: user.id }
                }
            });
            if (!channelOwner) {
                throw new common_1.ForbiddenException('User not in channel');
            }
            if (channelOwner.role != channel_user_entity_1.Role.Owner) {
                throw new common_1.ForbiddenException('User is not owner');
            }
            this.channelUsersRepository.delete({
                channel: channel,
            });
            this.channelsRepository.delete({
                channel_uid: channel.channel_uid
            });
        }
        catch (error) {
            console.log('error=', error.message);
            throw error;
        }
    }
    listChannelByUser(user) {
    }
    listPublicChannels() {
    }
    listProtectedChannels() {
    }
    async findChannelById(channel_id) {
        const channel = await this.channelsRepository.findOne({
            where: {
                channel_uid: channel_id
            }
        });
        return channel;
    }
    async getAllChannels() {
        return await this.channelsRepository.find();
        console.log('test');
    }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(2, (0, typeorm_1.InjectRepository)(channel_user_entity_1.ChannelUser)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map