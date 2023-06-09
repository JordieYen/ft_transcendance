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
const achievement_service_1 = require("../../achievement/services/achievement.service");
const user_achievement_entity_1 = require("../../typeorm/user_achievement.entity");
const users_service_1 = require("../../users/services/users.service");
const typeorm_2 = require("typeorm");
let UserAchievementService = class UserAchievementService {
    constructor(userAchievementRepository, userService, achievementService) {
        this.userAchievementRepository = userAchievementRepository;
        this.userService = userService;
        this.achievementService = achievementService;
    }
    async create(createUserAchievementDto) {
        const { userId, achievementId } = createUserAchievementDto;
        const existingRecord = await this.userAchievementRepository.findOne({
            where: {
                user: { id: userId },
                achievement: { id: achievementId },
            },
        });
        if (existingRecord) {
            throw new common_1.ConflictException('User achievement record already exists');
        }
        const [user, achievement] = await Promise.all([
            this.userService.findUsersById(userId),
            this.achievementService.findOne(achievementId),
        ]);
        if (!user) {
            throw new Error(`User with id ${userId} not found`);
        }
        if (!achievement) {
            throw new Error(`Achievement with id ${achievementId} not found`);
        }
        const userAchievement = new user_achievement_entity_1.UserAchievement();
        userAchievement.user = user;
        userAchievement.achievement = achievement;
        return await this.userAchievementRepository.save(userAchievement);
    }
    async findAll() {
        return await this.userAchievementRepository.find({
            relations: [
                'user',
                'achievement',
            ]
        });
    }
    async findOne(id) {
        const userAchievement = await this.userAchievementRepository.findOne({
            relations: ['user', 'achievement'],
            where: {
                id: id,
            }
        });
        if (!userAchievement)
            throw new common_1.NotFoundException(`User achievement with ${id} not found. `);
        return userAchievement;
    }
    async update(id, updateUserAchievementDto) {
        try {
            let userAchievement = await this.findOne(id);
            if (!userAchievement) {
                throw new Error(`User achievement with id ${id} not found`);
            }
            if (updateUserAchievementDto.userId) {
                const user = await this.userService.findUsersById(updateUserAchievementDto.userId);
                if (!user) {
                    throw new Error(`User with id ${updateUserAchievementDto.userId} not found`);
                }
                userAchievement.user = user;
            }
            if (updateUserAchievementDto.achievementId) {
                const achievement = await this.achievementService.findOne(updateUserAchievementDto.achievementId);
                if (!achievement) {
                    throw new Error(`Achievement with id ${updateUserAchievementDto.achievementId} not found`);
                }
                userAchievement.achievement = achievement;
            }
            userAchievement = await this.userAchievementRepository.save(userAchievement);
            return await userAchievement;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update user achievement');
        }
    }
    async remove(id) {
        const userAchievemnt = await this.findOne(id);
        if (!userAchievemnt) {
            throw new common_1.NotFoundException(`userAchievemnt with ID ${id} not found`);
        }
        return await this.userAchievementRepository.delete(id);
    }
};
UserAchievementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_achievement_entity_1.UserAchievement)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        achievement_service_1.AchievementService])
], UserAchievementService);
exports.UserAchievementService = UserAchievementService;
//# sourceMappingURL=user_achievement.service.js.map