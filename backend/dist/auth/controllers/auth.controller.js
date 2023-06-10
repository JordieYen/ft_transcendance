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
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const _42_auth_guard_1 = require("../util/42-auth.guard");
const user_decorator_1 = require("../../users/decorators/user.decorator");
const invalid_otp_exception_1 = require("../util/invalid_otp_exception");
const jwt_service_1 = require("@nestjs/jwt/dist/jwt.service");
const jwt_auth_guard_1 = require("../util/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
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
        const returnUser = await this.authService.getAuthUserProfile(user.id);
        return await returnUser;
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
    (0, swagger_1.ApiOperation)({
        summary: 'login to start your pong game',
    }),
    (0, common_1.Get)('login'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(_42_auth_guard_1.FortyTwoAuthGuard),
    (0, common_1.Get)('callback'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "callback", null);
__decorate([
    (0, common_1.Get)('2fa'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableTwoFactorAuth", null);
__decorate([
    (0, common_1.Post)('otp'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.Get)('session'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAuthSession", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('jwt'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getJwt", null);
__decorate([
    (0, common_1.Get)('profile'),
    openapi.ApiResponse({ status: 200, type: require("../../typeorm/user.entity").User }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('logout'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, swagger_1.ApiTags)('Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        jwt_service_1.JwtService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map