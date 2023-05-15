import { CreateAchievementDto } from './create-achievement.dto';
declare const UpdateAchievementDto_base: import("@nestjs/common").Type<Partial<CreateAchievementDto>>;
export declare class UpdateAchievementDto extends UpdateAchievementDto_base {
    name?: string;
    description?: string;
}
export {};
