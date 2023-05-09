import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<import("../../typeorm/users.entity").Users[]>;
    findUsersById(id: number): Promise<import("../../typeorm/users.entity").Users>;
    findUsersByName(username: string): Promise<import("../../typeorm/users.entity").Users>;
    createUsers(createUserDto: CreateUserDto): Promise<import("../../typeorm/users.entity").Users>;
    removeUser(id: number): Promise<{
        message: string;
    }>;
}
