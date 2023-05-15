import { Achievement } from "./achievement.entity";
import { User } from "./user.entity";
export declare class UserAchievement {
    id: number;
    user: User;
    achievement: Achievement;
    createdAt: Date;
}
