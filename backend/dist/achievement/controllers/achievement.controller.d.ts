import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';
import { AchievementService } from '../services/achievement.service';
export declare class AchievementController {
    private readonly achievementService;
    constructor(achievementService: AchievementService);
    reate(createAchievementDto: CreateAchievementDto): Promise<import("../../typeorm/achievement.entity").Achievement>;
    findAll(): Promise<import("../../typeorm/achievement.entity").Achievement[]>;
    findOne(id: string): Promise<import("../../typeorm/achievement.entity").Achievement>;
    update(id: number, updateAchievementDto: UpdateAchievementDto): Promise<import("../../typeorm/achievement.entity").Achievement>;
    remove(id: number): Promise<void>;
}
