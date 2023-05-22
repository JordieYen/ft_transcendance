import { Achievement } from 'src/typeorm/achievement.entity';
import { Repository } from 'typeorm';
import { CreateAchievementDto } from '../dto/create-achievement.dto';
import { UpdateAchievementDto } from '../dto/update-achievement.dto';
export declare class AchievementService {
    private achievementRepository;
    constructor(achievementRepository: Repository<Achievement>);
    create(createAchievementDto: CreateAchievementDto): Promise<Achievement>;
    findAll(): Promise<Achievement[]>;
    findOne(id: number): Promise<Achievement>;
    update(id: number, updateAchievementDto: UpdateAchievementDto): Promise<Achievement>;
    remove(id: number): Promise<void>;
}
