import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UsersService } from 'src/users/services/users.service';
export declare class UsersController {
    private readonly userService;
    constructor(userService: UsersService);
    getUsers(): Promise<import("../../typeorm").User[]>;
    findUsersById(id: number): Promise<import("../../typeorm").User>;
    createUsers(createUserDto: CreateUserDto): Promise<import("../../typeorm").User>;
}
