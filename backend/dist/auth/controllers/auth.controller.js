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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const local_guard_1 = require("../util/local.guard");
const _42_auth_guard_1 = require("../util/42-auth.guard");
const user_decorator_1 = require("../../users/decorators/user.decorator");
const invalid_otp_exception_1 = require("../util/invalid_otp_exception");
const jwt_service_1 = require("@nestjs/jwt/dist/jwt.service");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async login() { }
    async callback(req, res) {
        req.session.accessToken = req.user.accessToken;
        req.session.refreshToken = req.user.refreshToken;
        const existingUser = await this.authService.findOneOrCreate(req.user);
        req.session.user = existingUser;
        return res.redirect(`${process.env.NEXT_HOST}/pong-main`);
    }
    async enableTwoFactorAuth(req, res) {
        console.log('2fa', req.user);
        const otpAuthUrl = await this.authService.generateTwoFactorAuthSecret(req.user);
        await this.authService.displayQrCode(res, otpAuthUrl);
    }
    async verifyOtp(req, body) {
        const isValid = await this.authService.verifyOtp(body.otp);
        console.log(req.user);
        console.log('secret: ', process.env.JWT_SECRET);
        if (isValid) {
            const payload = {
                sub: 'shawn',
            };
            const token = this.jwtService.sign(payload, { secret: 'secret' });
            return token;
        }
        throw new invalid_otp_exception_1.InvalidOtpException();
    }
    async getAuthSession(session) {
        return [session, session.id];
    }
    async getProfile(user) {
        console.log(user);
        return user;
    }
    logout(req) {
        req.user = null;
        req.session.destroy();
        return {
            msg: 'The user session has ended. '
        };
    }
};
__decorate([
    (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoAuthGuard),
    (0, common_1.Get)('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoAuthGuard),
    (0, common_1.Get)('callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.Get)('2fa'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableTwoFactorAuth", null);
__decorate([
    (0, common_1.Post)('otp'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.UseGuards)(local_guard_1.AuthenticatedGuard),
    (0, common_1.Get)('session'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAuthSession", null);
__decorate([
    (0, common_1.UseGuards)(local_guard_1.AuthenticatedGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_service_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map