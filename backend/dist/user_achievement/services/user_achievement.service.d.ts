import { Achievement } from 'src/typeorm/achievement.entity';
import { User } from 'src/typeorm/user.entity';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';
import { Repository } from 'typeorm';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';
export declare class UserAchievementService {
    private userAchievementRepository;
    private userRepository;
    private achievementRepository;
    constructor(userAchievementRepository: Repository<UserAchievement>, userRepository: Repository<User>, achievementRepository: Repository<Achievement>);
    create(createUserAchievementDto: CreateUserAchievementDto): Promise<UserAchievement>;
    findAll(): Promise<UserAchievement[]>;
    findOne(id: number): string;
    update(id: number, updateUserAchievementDto: UpdateUserAchievementDto): string;
    remove(id: number): string;
}
