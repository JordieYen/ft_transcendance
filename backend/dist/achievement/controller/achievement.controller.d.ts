import { AchievementService } from '../achievement.service';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';
export declare class AchievementController {
    private readonly achievementService;
    constructor(achievementService: AchievementService);
    create(createAchievementDto: CreateAchievementDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateAchievementDto: UpdateAchievementDto): string;
    remove(id: string): string;
}
