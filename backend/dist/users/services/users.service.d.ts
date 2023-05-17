import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { User } from 'src/typeorm/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getUsers(): Promise<User[]>;
    findUsersById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    deleteUserById(id: number): Promise<import("typeorm").DeleteResult>;
    findUsersByName(username: string): Promise<User | null>;
}
