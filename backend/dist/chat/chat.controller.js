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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const chat_service_1 = require("./chat.service");
const dto_1 = require("./dto");
const user_decorator_1 = require("../users/decorators/user.decorator");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    testChannel(user) {
        return this.chatService.testChannel(user);
    }
    createChannel(dto, user) {
        return this.chatService.createChannel(dto, user);
    }
    joinChannel(dto, user) {
        return this.chatService.joinChannel(dto, user);
    }
    deleteChannel(channel_uid, user) {
        return this.chatService.deleteChannel(channel_uid, user);
    }
    listChannelByUser(user) {
        return this.chatService.listChannelByUser(user);
    }
    listPublicChannels() {
        return this.chatService.listPublicChannels();
    }
    listProtectedChannels() {
        return this.chatService.listProtectedChannels();
    }
    findChannelById(channel_id) {
        return this.chatService.findChannelById(channel_id);
    }
    async getAllChannels() {
        return await this.chatService.getAllChannels();
    }
};
__decorate([
    (0, common_1.Get)('test'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "testChannel", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateChatDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Post)('join'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.JoinChatDto, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "joinChannel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "deleteChannel", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "listChannelByUser", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "listPublicChannels", null);
__decorate([
    (0, common_1.Get)('protected'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "listProtectedChannels", null);
__decorate([
    (0, common_1.Get)(':channel_id'),
    __param(0, (0, common_1.Param)('channel_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatController.prototype, "findChannelById", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getAllChannels", null);
ChatController = __decorate([
    (0, common_1.Controller)('chat'),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map