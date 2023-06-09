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
const auth_service_1 = require("./services/auth.service");
const auth_controller_1 = require("./controllers/auth.controller");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const passport_1 = require("@nestjs/passport");
const session_serializer_1 = require("./util/session_serializer");
const jwt_1 = require("@nestjs/jwt");
const _42_strategy_1 = require("./util/42.strategy");
const jwt_strategy_1 = require("./util/jwt.strategy");
const users_module_1 = require("../users/users.module");
const jwtFactory = {
    imports: [config_1.ConfigModule],
    useFactory: async (configService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
            expiresIn: configService.get('JWT_EXP_H'),
        },
    }),
    inject: [config_1.ConfigService],
};
const passportFactory = {
    defaultStrategy: ['session', 'jwt-2fa'],
    session: true,
};
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule.register(passportFactory),
            jwt_1.JwtModule.registerAsync(jwtFactory),
            axios_1.HttpModule,
            users_module_1.UsersModule,
        ],
        providers: [
            config_1.ConfigService,
            jwt_1.JwtService,
            auth_service_1.AuthService,
            jwt_strategy_1.Jwt2faStrategy,
            _42_strategy_1.FortyTwoStrategy,
            session_serializer_1.SessionSerializer,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map