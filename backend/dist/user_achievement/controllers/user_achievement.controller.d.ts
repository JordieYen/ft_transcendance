import { UserAchievementService } from '../services/user_achievement.service';
import { CreateUserAchievementDto } from '../dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from '../dto/update-user_achievement.dto';
export declare class UserAchievementController {
    private readonly userAchievementService;
    constructor(userAchievementService: UserAchievementService);
    create(createUserAchievementDto: CreateUserAchievementDto): Promise<import("../../typeorm/user_achievement.entity").UserAchievement>;
    findAll(): Promise<import("../../typeorm/user_achievement.entity").UserAchievement[]>;
    findOne(id: string): string;
    update(id: string, updateUserAchievementDto: UpdateUserAchievementDto): string;
    remove(id: string): string;
}
