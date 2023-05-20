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
exports.UserAchievementController = void 0;
const common_1 = require("@nestjs/common");
const user_achievement_service_1 = require("../services/user_achievement.service");
const create_user_achievement_dto_1 = require("../dto/create-user_achievement.dto");
let UserAchievementController = class UserAchievementController {
    constructor(userAchievementService) {
        this.userAchievementService = userAchievementService;
    }
    async create(createUserAchievementDto) {
        return await this.userAchievementService.create(createUserAchievementDto);
    }
    async findAll() {
        return await this.userAchievementService.findAll();
    }
    async findOne(id) {
        return await this.userAchievementService.findOne(id);
    }
    async update(id, updateUserAchievementDto) {
        return await this.userAchievementService.update(id, updateUserAchievementDto);
    }
    async remove(id) {
        await this.userAchievementService.remove(id);
        return { message: ` User achievement with ${id} was deleted.` };
    }
};
__decorate([
    (0, common_1.Put)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_achievement_dto_1.CreateUserAchievementDto]),
    __metadata("design:returntype", Promise)
], UserAchievementController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserAchievementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserAchievementController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserAchievementController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserAchievementController.prototype, "remove", null);
UserAchievementController = __decorate([
    (0, common_1.Controller)('user-achievement'),
    __metadata("design:paramtypes", [user_achievement_service_1.UserAchievementService])
], UserAchievementController);
exports.UserAchievementController = UserAchievementController;
//# sourceMappingURL=user_achievement.controller.js.map