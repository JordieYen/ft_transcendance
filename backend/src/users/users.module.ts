import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}
