import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
export declare class AchievementService {
    create(createAchievementDto: CreateAchievementDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAchievementDto: UpdateAchievementDto): string;
    remove(id: number): string;
}
