"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserAchievementDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_user_achievement_dto_1 = require("./create-user_achievement.dto");
class UpdateUserAchievementDto extends (0, swagger_1.PartialType)(create_user_achievement_dto_1.CreateUserAchievementDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateUserAchievementDto = UpdateUserAchievementDto;
//# sourceMappingURL=update-user_achievement.dto.js.map