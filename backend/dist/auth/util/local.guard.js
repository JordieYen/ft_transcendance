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
exports.UserGuard = exports.AuthenticatedGuard = exports.LocalAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("../../users/services/users.service");
const auth_service_1 = require("../services/auth.service");
function getCookiesFromHeader(cookieHeader) {
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    const cookieData = cookies.reduce((data, cookie) => {
        const [key, value] = cookie.split('=');
        data[key] = value;
        return (data);
    }, {});
    return cookieData;
}
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
    async canActivate(context) {
        console.log('enter local auth guard');
        const result = (await super.canActivate(context));
        console.log('AuthGuard result:', result);
        const request = context.switchToHttp().getRequest();
        console.log('HTTP Request:', request);
        await super.logIn(request);
        console.log('User logged in');
        return (result);
    }
};
LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);
exports.LocalAuthGuard = LocalAuthGuard;
let AuthenticatedGuard = class AuthenticatedGuard {
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        return req.isAuthenticated();
    }
};
AuthenticatedGuard = __decorate([
    (0, common_1.Injectable)()
], AuthenticatedGuard);
exports.AuthenticatedGuard = AuthenticatedGuard;
let UserGuard = class UserGuard {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    async canActivate(context) {
        console.log('user guard start');
        const req = context.switchToHttp().getRequest();
        const cookieHeader = req.headers.cookie;
        const cookies = getCookiesFromHeader(cookieHeader);
        if (req === null || req === void 0 ? void 0 : req.user) {
            const user = await this.usersService.findUsersById(req.session.user.id);
            req.user = user;
            return true;
        }
        return false;
    }
};
UserGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService])
], UserGuard);
exports.UserGuard = UserGuard;
//# sourceMappingURL=local.guard.js.map