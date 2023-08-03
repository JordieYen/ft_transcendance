import { Achievement } from '../../typeorm/achievement.entity';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserAchievement } from 'src/typeorm/user_achievement.entity';

// run using npm run seed
export const achievementData = [
  { name: 'Im secured', description: 'setup 2FA for the first time' },
  { name: 'Lee Zii Jia', description: 'smash a total of 10 times' },
  { name: 'Bloodthirsty', description: 'execute a total of 5 kills' },
  { name: 'Merciless', description: 'execute a total of 10 kills' },
  { name: 'Ruthless', description: 'execute a total of 15 kills' },
  { name: 'Relentless', description: 'execute a total of 20 kills' },
  { name: 'Brutal', description: 'execute a total of 25 kills' },
  { name: 'Nuclear', description: 'execute a total of 30 kills' },
  { name: 'Unstoppable', description: 'execute a total of 50 kills' },
  { name: 'Kill Chain', description: 'achieve a flawless victory' },
];

export default class AchievementSeed implements Seeder {
  public async run(
    dataSource: DataSource,
    // factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('AchievementSeed');
    const achievementRepository = dataSource.getRepository(Achievement);
    for (const achievement of achievementData) {
      const existingAchievement = await achievementRepository.findOne({
        where: { name: achievement.name },
      });

      if (!existingAchievement) {
        await achievementRepository.insert(achievement);
      }
    }
  }
}
