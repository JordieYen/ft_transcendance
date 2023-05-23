"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMatchHistoryDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateMatchHistoryDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { match_uid: { required: true, type: () => Number }, winner_uid: { required: true, type: () => Number }, p1_uid: { required: true, type: () => Number }, p2_uid: { required: true, type: () => Number }, p1_score: { required: true, type: () => Number }, p2_score: { required: true, type: () => Number }, creation_date: { required: true, type: () => Date } };
    }
}
exports.CreateMatchHistoryDto = CreateMatchHistoryDto;
//# sourceMappingURL=create-match-history.dto.js.map