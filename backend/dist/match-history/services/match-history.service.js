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
exports.MatchHistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const match_history_entity_1 = require("../../typeorm/match_history.entity");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../../users/services/users.service");
let MatchHistoryService = class MatchHistoryService {
    constructor(matchHistoryRepository, userService) {
        this.matchHistoryRepository = matchHistoryRepository;
        this.userService = userService;
    }
    async getHistory() {
        return await this.matchHistoryRepository.find();
    }
    async getByMatchUid(uid) {
        return await this.matchHistoryRepository.find({
            where: {
                match_uid: uid
            }
        });
    }
    async getWinsByPlayerUid(uid) {
        return await this.matchHistoryRepository.find({
            where: {
                winner_uid: uid
            }
        });
    }
    async getByPlayerUid(uid) {
        return await this.matchHistoryRepository.find({
            where: [
                { p1_uid: { id: uid } },
                { p2_uid: { id: uid } }
            ]
        });
    }
    async getByScore(score) {
        return await this.matchHistoryRepository.find({
            where: [
                { p1_score: score },
                { p2_score: score }
            ]
        });
    }
    async getTotalGamesByPlayerUid(uid) {
        const total = (await this.getByPlayerUid(uid)).length;
        return (total);
    }
    async getTotalWinsByPlayerUid(uid) {
        const total = (await this.getWinsByPlayerUid(uid)).length;
        return (total);
    }
    async create(createMatchHistoryDto) {
        const newMatch = await this.matchHistoryRepository.create({
            winner_uid: createMatchHistoryDto.winner_uid,
            p1_uid: await this.userService.findUsersById(createMatchHistoryDto.p1_uid),
            p2_uid: await this.userService.findUsersById(createMatchHistoryDto.p2_uid),
            p1_score: createMatchHistoryDto.p1_score,
            p2_score: createMatchHistoryDto.p2_score
        });
        console.log(newMatch);
        try {
            await this.matchHistoryRepository.save(newMatch);
        }
        catch (error) {
            console.log('error=', error.message);
            throw new common_1.InternalServerErrorException('Could not create user');
        }
    }
    async remove(uid) {
        try {
            await this.matchHistoryRepository.delete(uid);
            return { message: 'User with uid ${uid} has been deleted successfully' };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
MatchHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(match_history_entity_1.MatchHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], MatchHistoryService);
exports.MatchHistoryService = MatchHistoryService;
//# sourceMappingURL=match-history.service.js.map