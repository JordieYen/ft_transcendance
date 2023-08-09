import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateGameInvitationDto } from '../dto/create-game-invitation.dto';
import { UpdateGameInvitationDto } from '../dto/update-game-invitation.dto';
import { GameInvitationService } from '../services/game-invitation.service';

@Controller('game-invitation')
@ApiTags('GameInvitation')
export class GameInvitationController {
  constructor(private readonly gameInvitationService: GameInvitationService) {}

  @Post()
  create(@Body() createGameInvitationDto: CreateGameInvitationDto) {
    return this.gameInvitationService.create(createGameInvitationDto);
  }

  @Get()
  findAll() {
    return this.gameInvitationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameInvitationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGameInvitationDto: UpdateGameInvitationDto,
  ) {
    return this.gameInvitationService.update(+id, updateGameInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameInvitationService.remove(+id);
  }

  @Get('receiver/:id')
  findInvitationsByReceiverId(@Param('id') id: number) {
    return this.gameInvitationService.findGameInvitationByReceiverId(+id);
  }

  // send game invitation
  // display game invitation
  // accept game invitation and update status
  // reject game invitation and update status
}
