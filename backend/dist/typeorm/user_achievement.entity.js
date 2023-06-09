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
exports.UserAchievement = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const achievement_entity_1 = require("./achievement.entity");
const user_entity_1 = require("./user.entity");
let UserAchievement = class UserAchievement {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, user: { required: true, type: () => require("./user.entity").User }, achievement: { required: true, type: () => require("./achievement.entity").Achievement }, createdAt: { required: true, type: () => Date } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserAchievement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.userAchievement),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserAchievement.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => achievement_entity_1.Achievement, achievement => achievement.userAchievements),
    (0, typeorm_1.JoinColumn)({ name: 'achievement_id' }),
    __metadata("design:type", achievement_entity_1.Achievement)
], UserAchievement.prototype, "achievement", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], UserAchievement.prototype, "createdAt", void 0);
UserAchievement = __decorate([
    (0, typeorm_1.Entity)()
], UserAchievement);
exports.UserAchievement = UserAchievement;
//# sourceMappingURL=user_achievement.entity.js.map