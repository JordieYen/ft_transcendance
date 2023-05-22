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
const _42_auth_guard_1 = require("../util/42-auth.guard");
const user_decorator_1 = require("../../users/decorators/user.decorator");
const invalid_otp_exception_1 = require("../util/invalid_otp_exception");
const jwt_service_1 = require("@nestjs/jwt/dist/jwt.service");
const jwt_auth_guard_1 = require("../util/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService, jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }
    async login() {
    }
    async callback(req, res) {
        return res.redirect(`${process.env.NEXT_HOST}/pong-main`);
    }
    async enableTwoFactorAuth(req, res) {
        const otpAuthUrl = await this.authService.generateTwoFactorAuthSecret(req.user);
        await this.authService.displayQrCode(res, otpAuthUrl);
    }
    async verifyOtp(req, res, body) {
        const isValid = await this.authService.verifyOtp(body.otp);
        if (isValid) {
            const payload = await this.authService.createPayload(req.user);
            const token = await this.authService.createToken(payload);
            res.setHeader('Authorization', `Bearer ${token}`);
            return res.send(token);
        }
        throw new invalid_otp_exception_1.InvalidOtpException();
    }
    async getAuthSession(session) {
        return await [session, session.id];
    }
    async getJwt() {
        return { msg: 'enter jwt guard' };
    }
    async getProfile(user) {
        return await user;
    }
    async logout(req, res) {
        if (req.user) {
            await this.authService.logout(req.user);
            await this.authService.clearUserSession(req);
            await this.authService.clearUserCookies(res);
            req.logout(() => { });
        }
        res.json({ message: 'User logout' });
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
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Get)('session'),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAuthSession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('jwt'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getJwt", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_service_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map