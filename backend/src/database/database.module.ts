import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import entities from '../typeorm';
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import AchievementSeed from './seeds/achievement.seed';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get('DB_HOST'),
        port: ConfigService.get('DB_PORT'),
        username: ConfigService.get('DB_USER'),
        password: ConfigService.get('DB_PASSWORD'),
        database: ConfigService.get('DB_NAME'),
        entities: entities,
        autoLoadEntities: true,
        synchronize: true,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        const seederOptions: SeederOptions = {
          seeds: ['./seeds/*.ts'],
          factories: ['./factories/*.ts'],
        };
        const achievementSeeder = new AchievementSeed();
        achievementSeeder.run(dataSource);
        // await runSeeders(dataSource, seederOptions);
        return dataSource;
      },
    }),
  ],
})
export class DatabaseModule {
  constructor(private readonly configService: ConfigService) {
    const dbHost = this.configService.get<string>('DB_HOST');
    const dbDatabase = this.configService.get<string>('DB_NAME');
    const dbPassword = this.configService.get<string>('DB_PASSWORD');
    const dbPort = this.configService.get<number>('DB_PORT');
    const dbName = this.configService.get<string>('DB_USER');

    console.log(`DB_HOST: ${dbHost}`);
    console.log(`DB_NAME: ${dbDatabase}`);
    console.log(`DB_PASSWORD: ${dbPassword}`);
    console.log(`DB_PORT: ${dbPort}`);
    console.log(`DB_USER: ${dbName}`);
  }
}
