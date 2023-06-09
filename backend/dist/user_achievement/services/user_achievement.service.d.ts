import { AchievementService } from 'src/achievement/services/achievement.service';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';
export declare class UserAchievementService {
    private userAchievementRepository;
    private readonly userService;
    private readonly achievementService;
    constructor(userAchievementRepository: Repository<UserAchievement>, userService: UsersService, achievementService: AchievementService);
    create(createUserAchievementDto: CreateUserAchievementDto): Promise<UserAchievement>;
    findAll(): Promise<UserAchievement[]>;
    findOne(id: number): Promise<UserAchievement>;
    update(id: number, updateUserAchievementDto: Partial<UpdateUserAchievementDto>): Promise<UserAchievement>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
