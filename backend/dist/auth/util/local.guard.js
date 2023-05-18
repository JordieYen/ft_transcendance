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
exports.AuthenticatedGuard = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/services/users.service");
const auth_service_1 = require("../services/auth.service");
const typeorm_1 = require("typeorm");
const session_entity_1 = require("../../typeorm/session.entity");
const typeorm_2 = require("@nestjs/typeorm");
let AuthenticatedGuard = class AuthenticatedGuard {
    constructor(authService, usersService, sessionRepository) {
        this.authService = authService;
        this.usersService = usersService;
        this.sessionRepository = sessionRepository;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        console.log('authenticate req user', req.user);
        console.log('authenticate req user', req.session.user);
        const sessionID = req.sessionID;
        const session = await this.sessionRepository.findOne({ where: { id: sessionID } });
        console.log('session', session);
        if (session) {
            console.log('retrieve session');
            const sessionData = JSON.parse(session.json);
            const user = sessionData.user;
            console.log('user', user);
            req.user = user;
            req.session.user = user;
            console.log('session', req.user);
            req.isAuthenticated = true;
            return (true);
        }
        return false;
    }
};
AuthenticatedGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_2.InjectRepository)(session_entity_1.SessionEntity)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        typeorm_1.Repository])
], AuthenticatedGuard);
exports.AuthenticatedGuard = AuthenticatedGuard;
//# sourceMappingURL=local.guard.js.map