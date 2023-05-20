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
exports.AchievementController = void 0;
const common_1 = require("@nestjs/common");
const create_achievement_dto_1 = require("../dto/create-achievement.dto");
const update_achievement_dto_1 = require("../dto/update-achievement.dto");
const achievement_service_1 = require("../services/achievement.service");
let AchievementController = class AchievementController {
    constructor(achievementService) {
        this.achievementService = achievementService;
    }
    async create(createAchievementDto) {
        return await this.achievementService.create(createAchievementDto);
    }
    async findAll() {
        return await this.achievementService.findAll();
    }
    async findOne(id) {
        return await this.achievementService.findOne(id);
    }
    async update(id, updateAchievementDto) {
        return await this.achievementService.update(id, updateAchievementDto);
    }
    async remove(id) {
        await this.achievementService.remove(id);
        return await `User achievement with id ${id} has been deleted.`;
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_achievement_dto_1.CreateAchievementDto]),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_achievement_dto_1.UpdateAchievementDto]),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AchievementController.prototype, "remove", null);
AchievementController = __decorate([
    (0, common_1.Controller)('achievement'),
    __metadata("design:paramtypes", [achievement_service_1.AchievementService])
], AchievementController);
exports.AchievementController = AchievementController;
//# sourceMappingURL=achievement.controller.js.map