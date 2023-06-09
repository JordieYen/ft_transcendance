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
exports.CreateMatchHistoryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateMatchHistoryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { winner_uid: { required: true, type: () => Number }, p1_uid: { required: true, type: () => Number }, p2_uid: { required: true, type: () => Number }, p1_score: { required: true, type: () => Number }, p2_score: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMatchHistoryDto.prototype, "winner_uid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMatchHistoryDto.prototype, "p1_uid", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateMatchHistoryDto.prototype, "p2_uid", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMatchHistoryDto.prototype, "p1_score", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateMatchHistoryDto.prototype, "p2_score", void 0);
exports.CreateMatchHistoryDto = CreateMatchHistoryDto;
//# sourceMappingURL=create-match-history.dto.js.map