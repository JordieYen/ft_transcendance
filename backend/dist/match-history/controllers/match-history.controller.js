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
exports.MatchHistoryController = void 0;
const common_1 = require("@nestjs/common");
const match_history_service_1 = require("../services/match-history.service");
const create_match_history_dto_1 = require("../dto/create-match-history.dto");
let MatchHistoryController = class MatchHistoryController {
    constructor(matchHistoryService) {
        this.matchHistoryService = matchHistoryService;
    }
    async getHistory() {
        return this.matchHistoryService.getHistory();
    }
    async getByMatchUid(uid) {
        return this.matchHistoryService.getByMatchUid(+uid);
    }
    async getByPlayerUid(uid) {
        return this.matchHistoryService.getByPlayerUid(+uid);
    }
    async getByScore(score) {
        return this.matchHistoryService.getByScore(+score);
    }
    async create(createMatchHistoryDto) {
        return this.matchHistoryService.create(createMatchHistoryDto);
    }
    async remove(uid) {
        return await this.matchHistoryService.remove(+uid);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('match'),
    __param(0, (0, common_1.Query)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "getByMatchUid", null);
__decorate([
    (0, common_1.Get)('player'),
    __param(0, (0, common_1.Query)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "getByPlayerUid", null);
__decorate([
    (0, common_1.Get)('score'),
    __param(0, (0, common_1.Query)('score')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "getByScore", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_match_history_dto_1.CreateMatchHistoryDto]),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)('match'),
    __param(0, (0, common_1.Query)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchHistoryController.prototype, "remove", null);
MatchHistoryController = __decorate([
    (0, common_1.Controller)('match-history'),
    __metadata("design:paramtypes", [match_history_service_1.MatchHistoryService])
], MatchHistoryController);
exports.MatchHistoryController = MatchHistoryController;
//# sourceMappingURL=match-history.controller.js.map