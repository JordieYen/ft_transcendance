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
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./services/auth.service");
const auth_controller_1 = require("./controllers/auth.controller");
const users_service_1 = require("../users/services/users.service");
const typeorm_module_1 = require("@nestjs/typeorm/dist/typeorm.module");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../typeorm/user.entity");
const passport_1 = require("@nestjs/passport");
const session_serializer_1 = require("./util/session_serializer");
const jwt_1 = require("@nestjs/jwt");
const _42_strategy_1 = require("./util/42.strategy");
const session_entity_1 = require("../typeorm/session.entity");
const jwt_strategy_1 = require("./util/jwt.strategy");
let AuthModule = class AuthModule {
    constructor(configService) {
        this.configService = configService;
        const jwtSecret = this.configService.get('JWT_SECRET');
        console.log(`JWTSECRET: ${jwtSecret}`);
    }
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_module_1.TypeOrmModule.forFeature([user_entity_1.User, session_entity_1.SessionEntity]),
            passport_1.PassportModule.register({
                defaultStrategy: 'session',
                session: true,
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (ConfigService) => ({
                    secret: ConfigService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
                inject: [config_1.ConfigService],
            })
        ],
        providers: [
            config_1.ConfigService,
            jwt_1.JwtService,
            users_service_1.UsersService,
            auth_service_1.AuthService,
            _42_strategy_1.FortyTwoStrategy,
            jwt_strategy_1.JwtStrategy,
            session_serializer_1.SessionSerializer,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService]
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map