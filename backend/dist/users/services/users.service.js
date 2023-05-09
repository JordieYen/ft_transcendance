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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../../typeorm/users.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async createUser(createUserDto) {
        const newUser = this.usersRepository.create(createUserDto);
        console.log(newUser);
        try {
            return await this.usersRepository.save(newUser);
        }
        catch (error) {
            console.log(error.message);
            throw new common_1.InternalServerErrorException('Could not create user');
        }
    }
    getUsers() {
        return this.usersRepository.find();
    }
    findUsersById(id) {
        return this.usersRepository.findOneBy({ id });
    }
    findAll() {
        return this.usersRepository.find();
    }
    async deleteUserById(id) {
        return await this.usersRepository.delete(id);
    }
    async findUsersByName(username) {
        return await this.usersRepository.findOneBy({ username });
    }
    async findUsersByEmail(email) {
        return await this.usersRepository.findOneBy({ email });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map