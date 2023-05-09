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
                username: ConfigService.get('DB_USER'),
                password: ConfigService.get('DB_PASSWORD'),
                database: ConfigService.get('DB_NAME'),
                // entities: [
                //   __dirname + '/**/*.entity{.ts,.js}',
                // ],
                entities: entities,
                autoLoadEntities: true,
                synchronize: true,
                // synchronize: false
            }),
        }),
    ],
})
export class DatabaseModule {
    constructor(private readonly configService: ConfigService) {
        const dbHost = this.configService.get<string>('DB_HOST');
        const dbDatabase = this.configService.get<string>('DB_NAME');
        const dbPassword = this.configService.get<string>('DB_PASSWORD');
        const dbPort = this.configService.get<string>('DB_PORT');
        const dbName = this.configService.get<string>('DB_USER');

        console.log(`DB_HOST: ${dbHost}`);
        console.log(`DB_NAME: ${dbDatabase}`);
        console.log(`DB_PASSWORD: ${dbPassword}`);
        console.log(`DB_PORT: ${dbPort}`);
        console.log(`DB_USER: ${dbName}`);
    }
}
