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
const users_service_1 = require("../users/services/users.service");
const typeorm_module_1 = require("@nestjs/typeorm/dist/typeorm.module");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const user_entity_1 = require("../typeorm/user.entity");
const passport_1 = require("@nestjs/passport");
const local_strategy_1 = require("./util/local_strategy");
const session_serializer_1 = require("./util/session_serializer");
const bearer_strategy_1 = require("./util/bearer_strategy");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("./util/jwt.strategy");
const local_guard_1 = require("./util/local.guard");
const jwt_auth_guard_1 = require("./util/jwt-auth.guard");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_module_1.TypeOrmModule.forFeature([user_entity_1.User]),
            axios_1.HttpModule,
            passport_1.PassportModule.register({
                defaultStrategy: 'bearer',
                session: true,
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (ConfigService) => ({
                    secret: ConfigService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1h' },
                }),
                inject: [config_1.ConfigService],
            })
        ],
        providers: [
            auth_service_1.AuthService,
            users_service_1.UsersService,
            config_1.ConfigService,
            local_strategy_1.LocalStrategy,
            session_serializer_1.SessionSerializer,
            bearer_strategy_1.BearerStrategy,
            jwt_strategy_1.JwtStrategy,
            jwt_auth_guard_1.JwtAuthGuard,
            local_guard_1.UserGuard,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map