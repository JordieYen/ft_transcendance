"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./controllers/users.controller");
const users_service_1 = require("./services/users.service");
const typeorm_1 = require("@nestjs/typeorm");
<<<<<<< HEAD
const users_entity_1 = require("../typeorm/users.entity");
=======
const user_entity_1 = require("../typeorm/user.entity");
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
<<<<<<< HEAD
        imports: [typeorm_1.TypeOrmModule.forFeature([users_entity_1.Users]),],
=======
        imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),],
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map