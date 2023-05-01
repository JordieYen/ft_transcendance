import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Users]), ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
