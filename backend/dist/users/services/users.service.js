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
const user_entity_1 = require("../../typeorm/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async createUser(createUserDto) {
        console.log(createUserDto);
        const newUser = this.usersRepository.create(createUserDto);
        console.log('test', newUser);
        try {
            return await this.usersRepository.save(newUser);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Could not create user');
        }
    }
    async getUsers() {
        return await this.usersRepository.find();
    }
    async findUsersById(id) {
        if (id === undefined) {
            return null;
        }
        const user = await this.usersRepository.findOne({
            where: {
                id: id
            }
        });
        if (!user)
            throw new common_1.InternalServerErrorException('User not found');
        return (user);
    }
    async findUsersByIntraId(intra_uid) {
        const user = await this.usersRepository.findOne({
            where: {
                intra_uid: intra_uid
            }
        });
        if (!user)
            return null;
        return user;
    }
    async findAll() {
        return await this.usersRepository.find();
    }
    async deleteUserById(id) {
        const user = await this.findUsersById(id);
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        return await this.usersRepository.delete(id);
    }
    async findUsersByName(username) {
        const user = await this.usersRepository.findOne({
            where: {
                username: username
            }
        });
        if (!user)
            throw new common_1.NotFoundException(`User with username: ${username} not found`);
        return await user;
    }
    async uploadAvatar(id, avatar) {
        try {
            const user = await this.findUsersById(id);
            user.avatar = avatar;
            return await this.usersRepository.save(user);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Could not upload avatar');
        }
    }
    async updateUser(id, updateUserDto) {
        if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
            throw new common_1.BadRequestException('No update data provided');
        }
        try {
            const updatedUserDto = Object.assign(Object.assign({}, updateUserDto), { updatedAt: new Date() });
            await this.usersRepository.update(id, updatedUserDto);
            return await this.findUsersById(id);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to update user');
        }
    }
    async findUsersByIdWithRelation(id) {
        const user = await this.usersRepository.findOne({
            relations: [
                'userAchievement',
                'userAchievement.achievement',
                'stat',
                'p1_match',
                'p1_match.p1_uid',
                'p1_match.p2_uid',
                'p2_match',
                'p2_match.p1_uid',
                'p2_match.p2_uid',
                'sentFriendRequest',
                'receiveFriendRequest',
            ],
            where: {
                id: id,
            }
        });
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        return await user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map