import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { GameInvitationStatus } from 'src/typeorm/game_invitation.entity';

export class CreateGameInvitationDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsOptional()
  status: GameInvitationStatus;
}
