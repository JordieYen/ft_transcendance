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
exports.AchievementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const achievement_entity_1 = require("../../typeorm/achievement.entity");
const typeorm_2 = require("typeorm");
let AchievementService = class AchievementService {
    constructor(achievementRepository) {
        this.achievementRepository = achievementRepository;
    }
    async create(createAchievementDto) {
        const newAchievement = this.achievementRepository.create(createAchievementDto);
        return await this.achievementRepository.save(newAchievement);
    }
    async findAll() {
        return await this.achievementRepository.find();
    }
    async findOne(id) {
        const achievement = await this.achievementRepository.findOneBy({ id });
        if (!achievement) {
            throw new common_1.NotFoundException(`Achievement with ID ${id} not found`);
        }
        return achievement;
    }
    async update(id, updateAchievementDto) {
        const achievement = await this.achievementRepository.findOneBy({ id });
        if (!achievement)
            throw new Error(`Achievement with id ${id} not found`);
        const updateAchievement = Object.assign(Object.assign({}, achievement), updateAchievementDto);
        return await this.achievementRepository.save(updateAchievement);
    }
    async remove(id) {
        const achievement = await this.findOne(id);
        await await this.achievementRepository.remove(achievement);
    }
};
AchievementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(achievement_entity_1.Achievement)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AchievementService);
exports.AchievementService = AchievementService;
//# sourceMappingURL=achievement.service.js.map