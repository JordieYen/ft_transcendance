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
const users_service_1 = require("../users/services/users.service");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
const http_service_1 = require("@nestjs/axios/dist/http.service");
const user_entity_1 = require("../typeorm/user.entity");
let AuthService = class AuthService {
    constructor(userService, configService, httpService) {
        this.userService = userService;
        this.configService = configService;
        this.httpService = httpService;
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
            console.log(accessToken);
            const profileResponse = await axios_1.default.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            console.log('Profile reposnze data', profileResponse.data);
            const user = new user_entity_1.User();
            user.intra_uid = profileResponse.data.id;
            user.username = profileResponse.data.login;
            user.avatar = profileResponse.data.image.link;
            user.online = false;
            console.log('users info', user);
            const existingUser = await this.userService.findUsersByName(user.username);
            if (existingUser) {
                return (existingUser);
            }
            else {
                console.log('CREATE USER');
                return await this.userService.createUser(user);
            }
        }
        catch (error) {
            if (error.response) {
                console.log('RESPONSE', error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
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
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        config_1.ConfigService,
        http_service_1.HttpService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map