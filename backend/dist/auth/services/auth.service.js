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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../../users/services/users.service");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const user_entity_1 = require("../../typeorm/user.entity");
const otplib_1 = require("otplib");
const qrcode = require("qrcode");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userService, configService, jwtService) {
        this.userService = userService;
        this.configService = configService;
        this.jwtService = jwtService;
    }
    async redirectTo42OAuth(res) {
        const client_id = this.configService.get('CLIENT_ID');
        const redirect_uri = `http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`;
        const authorizeUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=public`;
        return res.redirect(authorizeUrl);
    }
    async authenticateUser(code, req) {
        try {
            const { data: tokenResponse } = await axios_1.default.post('https://api.intra.42.fr/oauth/token', {
                grant_type: 'authorization_code',
                client_id: this.configService.get('CLIENT_ID'),
                client_secret: this.configService.get('CLIENT_SECRET'),
                redirect_uri: 'http://localhost:3000/auth/callback',
                code,
            });
            const accessToken = tokenResponse.access_token;
            const refreshToken = tokenResponse.refresh_token;
            req.res.setHeader('Set-Cookie', [
                `refresh_token=${refreshToken}`,
                `access_token=${accessToken}`,
            ]);
            const cookieHeader = req.res.getHeader('Set-Cookie');
            const profileResponse = await axios_1.default.get('https://api.intra.42.fr/v2/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });
            const user = new user_entity_1.User();
            user.intra_uid = profileResponse.data.id;
            user.username = profileResponse.data.login;
            user.avatar = profileResponse.data.image.link;
            user.online = false;
            let existingUser = await this.userService.findUsersByName(user.username);
            if (!existingUser) {
                existingUser = await this.userService.createUser(user);
            }
            req.session.user = existingUser;
            return existingUser;
        }
        catch (error) {
            if (error.response) {
                console.log('RESPONSE', error.response.data);
            }
            else if (error.request) {
                console.log('REQUEST', error.request);
            }
            else {
                console.log('Error', error.message);
            }
        }
        ;
    }
    async validateUser(username) {
        const user = await this.userService.findUsersByName(username);
        if (user)
            return (user);
        return (null);
    }
    async findOneOrCreate(profile) {
        let returnUser = await this.userService.findUsersByIntraId(+profile.id);
        if (!returnUser) {
            const newUser = new user_entity_1.User();
            newUser.intra_uid = +profile.id;
            newUser.username = profile.username;
            newUser.avatar = profile._json.image.link;
            newUser.online = true;
            returnUser = await this.userService.createUser(newUser);
        }
        return (returnUser);
    }
    async generateTwoFactorAuthSecret(user) {
        this.secret = otplib_1.authenticator.generateSecret();
        const otpAuthUrl = otplib_1.authenticator.keyuri(user.username, 'MyApp', this.secret);
        return otpAuthUrl;
    }
    async displayQrCode(res, otpAuthUrl) {
        const qrCode = await qrcode.toFileStream(res, otpAuthUrl);
    }
    async verifyOtp(otp) {
        return otplib_1.authenticator.check(otp, this.secret);
    }
    async logout(user) {
        return await this.userService.updateUser(user.id, { online: false });
    }
    async clearUserSession(req) {
        return await new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async clearUserCookies(res) {
        res.clearCookie('ft_transcendence_session_id');
        res.clearCookie('jwt');
    }
    async createPayload(user) {
        const payload = {
            sub: user.id.toString(),
            username: user.username,
        };
        return payload;
    }
    async createToken(payload) {
        const token = await this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
        });
        return token;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map