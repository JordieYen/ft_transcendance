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
let ChatService = class ChatService {
    constructor(channelsRepository, channelUsersRepository) {
        this.channelsRepository = channelsRepository;
        this.channelUsersRepository = channelUsersRepository;
    }
    async createChannel(dto) {
        try {
            const newChannel = await this.channelsRepository.create({
                channel_name: dto.channel_name,
                channel_type: dto.channel_type,
                channel_hash: dto.channel_hash
            });
            console.log(newChannel);
            await this.channelsRepository.save(newChannel);
            return newChannel;
        }
        catch (error) {
            console.log('error=', error.message);
            throw new common_1.InternalServerErrorException('Channel not created');
        }
    }
    async enterChannel() { }
};
ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
    __param(1, (0, typeorm_1.InjectRepository)(channel_user_entity_1.ChannelUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ChatService);
exports.ChatService = ChatService;
//# sourceMappingURL=chat.service.js.map