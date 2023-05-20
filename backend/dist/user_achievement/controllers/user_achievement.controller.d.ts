import { UserAchievementService } from '../services/user_achievement.service';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';
export declare class UserAchievementController {
    private readonly userAchievementService;
    constructor(userAchievementService: UserAchievementService);
    create(createUserAchievementDto: CreateUserAchievementDto): Promise<import("../../typeorm/user_achievement.entity").UserAchievement>;
    findAll(): Promise<import("../../typeorm/user_achievement.entity").UserAchievement[]>;
    findOne(id: number): Promise<import("../../typeorm/user_achievement.entity").UserAchievement>;
    update(id: number, updateUserAchievementDto: Partial<UpdateUserAchievementDto>): Promise<import("../../typeorm/user_achievement.entity").UserAchievement>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
