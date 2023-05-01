import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<import("../../typeorm").Users[]>;
    findUsersById(id: number): Promise<import("../../typeorm").Users>;
    createUsers(createUserDto: CreateUserDto): Promise<import("../../typeorm").Users>;
    removeUser(id: number): Promise<{
        message: string;
    }>;
}
