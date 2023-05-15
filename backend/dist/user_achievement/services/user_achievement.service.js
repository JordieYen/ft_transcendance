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
exports.UserAchievementService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const achievement_entity_1 = require("../../typeorm/achievement.entity");
const user_entity_1 = require("../../typeorm/user.entity");
const user_achievement_entity_1 = require("../../typeorm/user_achievement.entity");
const typeorm_2 = require("typeorm");
let UserAchievementService = class UserAchievementService {
    constructor(userAchievementRepository, userRepository, achievementRepository) {
        this.userAchievementRepository = userAchievementRepository;
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
    }
    async create(createUserAchievementDto) {
        const { userId, achievementId } = createUserAchievementDto;
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        const achievement = await this.achievementRepository.findOneBy({ id: achievementId });
        if (!achievement) {
            throw new Error(`Achievement with id ${achievementId} not found`);
        }
        const userAchievement = new user_achievement_entity_1.UserAchievement();
        userAchievement.user = user;
        userAchievement.achievement = achievement;
        return this.userAchievementRepository.save(userAchievement);
    }
    findAll() {
        return `This action returns all userAchievement`;
    }
    findOne(id) {
        return `This action returns a #${id} userAchievement`;
    }
    update(id, updateUserAchievementDto) {
        return `This action updates a #${id} userAchievement`;
    }
    remove(id) {
        return `This action removes a #${id} userAchievement`;
    }
};
UserAchievementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_achievement_entity_1.UserAchievement)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(achievement_entity_1.Achievement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UserAchievementService);
exports.UserAchievementService = UserAchievementService;
//# sourceMappingURL=user_achievement.service.js.map