"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAchievementModule = void 0;
const common_1 = require("@nestjs/common");
const user_achievement_service_1 = require("./services/user_achievement.service");
const user_achievement_controller_1 = require("./controllers/user_achievement.controller");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../typeorm/user.entity");
const achievement_entity_1 = require("../typeorm/achievement.entity");
const user_achievement_entity_1 = require("../typeorm/user_achievement.entity");
let UserAchievementModule = class UserAchievementModule {
};
UserAchievementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                achievement_entity_1.Achievement,
                user_achievement_entity_1.UserAchievement
            ])
        ],
        controllers: [user_achievement_controller_1.UserAchievementController],
        providers: [user_achievement_service_1.UserAchievementService]
    })
], UserAchievementModule);
exports.UserAchievementModule = UserAchievementModule;
//# sourceMappingURL=user_achievement.module.js.map