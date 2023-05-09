"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const users_service_1 = require("../users/services/users.service");
const typeorm_module_1 = require("@nestjs/typeorm/dist/typeorm.module");
const users_entity_1 = require("../typeorm/users.entity");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_module_1.TypeOrmModule.forFeature([users_entity_1.Users]), axios_1.HttpModule],
        providers: [auth_service_1.AuthService, users_service_1.UsersService, config_1.ConfigService,
            {
                provide: 'AXIOS_INSTANCE_TOKEN',
                useValue: new axios_1.HttpService(),
            }],
        controllers: [auth_controller_1.AuthController]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map