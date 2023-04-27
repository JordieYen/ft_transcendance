import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModuleRef} from '@nestjs/core';
import entities from './typeorm';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
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
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: TypeOrmModule,
    //   useFactory: async (ModuleRef: ModuleRef) => {
    //     const options = await ModuleRef.resolve(TypeOrmModule);
    //     return new TypeOrmModule(options);
    // },
    // inject: [ModuleRef],
  // },
    {
      provide: 'MY_MODULE_REF',
      useValue: ModuleRef,
    },
  ],
  exports: ['MY_MODULE_REF', TypeOrmModule],
})
export class AppModule {}
