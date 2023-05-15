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
exports.BearerStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("../services/auth.service");
const passport_http_bearer_1 = require("passport-http-bearer");
let BearerStrategy = class BearerStrategy extends (0, passport_1.PassportStrategy)(passport_http_bearer_1.Strategy, 'bearer') {
    constructor(authService) {
        console.log('bearer strategy CUSTOMMMMM ');
        super();
        this.authService = authService;
    }
    async validate(token, req, done) {
        console.log('BEARER STRATEGY VALIDATE');
        console.log('token', token);
        const user = await this.authService.authenticateUser(token, req);
        console.log('user', user);
        if (!user) {
            return done('Invalid token', false);
        }
        return done(null, user);
    }
};
BearerStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], BearerStrategy);
exports.BearerStrategy = BearerStrategy;
//# sourceMappingURL=bearer_strategy.js.map