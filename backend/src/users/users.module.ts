import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/user.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MulterModule.register({
            dest: '../upload',
        })
     ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
