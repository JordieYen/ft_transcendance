import { CreateUserAchievementDto } from './dto/create-user_achievement.dto';
import { UpdateUserAchievementDto } from './dto/update-user_achievement.dto';
export declare class UserAchievementService {
    create(createUserAchievementDto: CreateUserAchievementDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserAchievementDto: UpdateUserAchievementDto): string;
    remove(id: number): string;
}
