"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchHistoryModule = void 0;
const common_1 = require("@nestjs/common");
const match_history_service_1 = require("./services/match-history.service");
const match_history_controller_1 = require("./controllers/match-history.controller");
const typeorm_1 = require("@nestjs/typeorm");
const match_history_entity_1 = require("../typeorm/match_history.entity");
const users_service_1 = require("../users/services/users.service");
const user_entity_1 = require("../typeorm/user.entity");
let MatchHistoryModule = class MatchHistoryModule {
};
MatchHistoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([match_history_entity_1.MatchHistory, user_entity_1.User])],
        controllers: [match_history_controller_1.MatchHistoryController],
        providers: [match_history_service_1.MatchHistoryService, users_service_1.UsersService]
    })
], MatchHistoryModule);
exports.MatchHistoryModule = MatchHistoryModule;
//# sourceMappingURL=match-history.module.js.map