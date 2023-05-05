import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import entities from '../typeorm';

@Module({
    imports: [
        // ConfigModule.forRoot({ 
        //     isGlobal: true,
            // envFilePath: ['../.env'],
        // }),
        TypeOrmModule.forRootAsync({
            imports: [ ConfigModule],
            inject: [ConfigService],
            useFactory: (ConfigService: ConfigService) => ({
                type: 'postgres',
                host: ConfigService.get('DB_HOST'),
                port: ConfigService.get<number>('DB_PORT'),
                username: ConfigService.get('DB_USERNAME'),
                password: ConfigService.get('DB_PASSWORD'),
                database: ConfigService.get('DB_NAME'),
                // entities: [
                //   __dirname + '/**/*.entity{.ts,.js}',
                // ],
                entities: entities,
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
    ],
})
export class DatabaseModule {
    constructor(private readonly configService: ConfigService) {
        const dbHost = this.configService.get<string>('DB_USER');
        const dbDatabase = this.configService.get<string>('DB_NAME');
        console.log(`DB_HOST: ${dbHost}`);
        console.log(`DB_NAME: ${dbDatabase}`);
    }
}
