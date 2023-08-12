import { PartialType } from '@nestjs/swagger';
import { CreateGameInvitationDto } from './create-game-invitation.dto';

export class UpdateGameInvitationDto extends PartialType(CreateGameInvitationDto) {}
