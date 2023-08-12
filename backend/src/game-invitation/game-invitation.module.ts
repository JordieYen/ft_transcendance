import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameInvitation } from 'src/typeorm/game_invitation.entity';
import { UsersModule } from 'src/users/users.module';
import { GameInvitationController } from './controllers/game-invitation.controller';
import { GameInvitationService } from './services/game-invitation.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameInvitation]), UsersModule],
  controllers: [GameInvitationController],
  providers: [GameInvitationService],
  exports: [GameInvitationService, TypeOrmModule],
})
export class GameInvitationModule {}
