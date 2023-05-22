import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Achievement } from "./achievement.entity";
import { User } from "./user.entity";

@Entity()
export class UserAchievement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userAchievement)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Achievement, achievement => achievement.userAchievements)
    @JoinColumn({ name: 'achievement_id' })
    achievement: Achievement;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;
}
