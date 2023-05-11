import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
<<<<<<< HEAD
    getUsers(): Promise<import("../../typeorm/users.entity").Users[]>;
    findUsersById(id: number): Promise<import("../../typeorm/users.entity").Users>;
    findUsersByName(username: string): Promise<import("../../typeorm/users.entity").Users>;
    createUsers(createUserDto: CreateUserDto): Promise<import("../../typeorm/users.entity").Users>;
=======
    getUsers(): Promise<import("../../typeorm/user.entity").User[]>;
    findUsersById(id: number): Promise<import("../../typeorm/user.entity").User>;
    findUsersByName(username: string): Promise<import("../../typeorm/user.entity").User>;
    createUsers(createUserDto: CreateUserDto): Promise<import("../../typeorm/user.entity").User>;
>>>>>>> 56525b5ef61670041761c2190d6c528e3234d671
    removeUser(id: number): Promise<{
        message: string;
    }>;
}
