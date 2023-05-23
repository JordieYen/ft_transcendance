"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const config_module_1 = require("@nestjs/config/dist/config.module");
const match_history_module_1 = require("./match-history/match-history.module");
const achievement_module_1 = require("./achievement/achievement.module");
const user_achievement_module_1 = require("./user_achievement/user_achievement.module");
const config_schema_1 = require("./config/config.schema");
const friend_module_1 = require("./friend/friend.module");
const stat_module_1 = require("./stat/stat.module");
const configFactory = {
    isGlocal: true,
    envFilePath: '../.env',
    validationSchema: config_schema_1.configValidationSchema,
    cache: true,
};
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            config_module_1.ConfigModule.forRoot(configFactory),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            match_history_module_1.MatchHistoryModule,
            achievement_module_1.AchievementModule,
            user_achievement_module_1.UserAchievementModule,
            friend_module_1.FriendModule,
            stat_module_1.StatModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map