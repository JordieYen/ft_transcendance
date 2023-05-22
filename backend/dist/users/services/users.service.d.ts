import { Repository } from 'typeorm';
import { User } from 'src/typeorm/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    getUsers(): Promise<User[]>;
    findUsersById(id: number): Promise<User | null>;
    findUsersByIntraId(intra_uid: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    deleteUserById(id: number): Promise<import("typeorm").DeleteResult>;
    findUsersByName(username: string): Promise<User | null>;
    uploadAvatar(id: number, avatar: string): Promise<User>;
    updateUser(id: number, updateUserDto: Partial<UpdateUserDto>): Promise<User>;
    findUsersByIdWithRelation(id: number): Promise<User>;
}
