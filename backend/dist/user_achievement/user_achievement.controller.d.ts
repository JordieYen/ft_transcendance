import { UserAchievementService } from './user_achievement.service';
import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
export declare class UserAchievementController {
    private readonly userAchievementService;
    constructor(userAchievementService: UserAchievementService);
    create(createUserAchievementDto: CreateUserAchievementDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserAchievementDto: UpdateUserAchievementDto): string;
    remove(id: string): string;
}
