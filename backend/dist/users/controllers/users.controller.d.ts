/// <reference types="multer" />
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<import("../../typeorm/user.entity").User[]>;
    findUsersById(id: number): Promise<import("../../typeorm/user.entity").User>;
    findUsersByName(username: string): Promise<import("../../typeorm/user.entity").User>;
    createUsers(createUserDto: CreateUserDto): Promise<import("../../typeorm/user.entity").User>;
    removeUser(id: number): Promise<{
        message: string;
    }>;
    uploadAvatar(file: Express.Multer.File, id: number): Promise<{
        message: string;
    }>;
    updateUser(id: number, updateUserDto: UpdateUserDto): Promise<import("../../typeorm/user.entity").User>;
    getUserProfile(id: number): Promise<import("../../typeorm/user.entity").User>;
}
