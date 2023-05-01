import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { Users } from 'src/typeorm/users.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<Users>);
    createUser(createUserDto: CreateUserDto): Promise<Users>;
    getUsers(): Promise<Users[]>;
    findUsersById(id: number): Promise<Users | null>;
    findAll(): Promise<Users[]>;
    deleteUserById(id: number): Promise<import("typeorm").DeleteResult>;
    findOne(username: string): Promise<Users>;
}
