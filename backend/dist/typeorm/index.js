"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchHistory = exports.Users = void 0;
const match_history_entity_1 = require("./match_history.entity");
Object.defineProperty(exports, "MatchHistory", { enumerable: true, get: function () { return match_history_entity_1.MatchHistory; } });
const users_entity_1 = require("./users.entity");
Object.defineProperty(exports, "Users", { enumerable: true, get: function () { return users_entity_1.Users; } });
const entities = [users_entity_1.Users, match_history_entity_1.MatchHistory];
exports.default = entities;
//# sourceMappingURL=index.js.map