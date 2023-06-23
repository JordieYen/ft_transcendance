import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAchievement } from './user_achievement.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => UserAchievement,
    (userAchievement) => userAchievement.achievement,
    { cascade: true },
  )
  userAchievements: UserAchievement[];
}
