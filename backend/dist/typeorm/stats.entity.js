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
exports.Stat = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Stat = class Stat {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, user: { required: true, type: () => require("./user.entity").User }, wins: { required: true, type: () => Number }, losses: { required: true, type: () => Number }, mmr: { required: true, type: () => Number }, total_games: { required: true, type: () => Number }, winStreak: { required: true, type: () => Number } };
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stat.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Stat.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, user => user.stat),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Stat.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stat.prototype, "wins", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stat.prototype, "losses", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stat.prototype, "mmr", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stat.prototype, "total_games", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Stat.prototype, "winStreak", void 0);
Stat = __decorate([
    (0, typeorm_1.Entity)()
], Stat);
exports.Stat = Stat;
//# sourceMappingURL=stats.entity.js.map