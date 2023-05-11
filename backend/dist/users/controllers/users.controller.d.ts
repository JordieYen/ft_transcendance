import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
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
}
