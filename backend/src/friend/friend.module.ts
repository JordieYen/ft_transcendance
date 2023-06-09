import { Module } from '@nestjs/common';
import { FriendService } from './services/friend.service';
import { FriendController } from './controllers/friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/typeorm/friends.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend]),
    UsersModule,
  ],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService, TypeOrmModule]
})
export class FriendModule {}
