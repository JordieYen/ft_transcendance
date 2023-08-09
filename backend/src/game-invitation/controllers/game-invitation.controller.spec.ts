import { Test, TestingModule } from '@nestjs/testing';
import { GameInvitationService } from '../services/game-invitation.service';
import { GameInvitationController } from './game-invitation.controller';

describe('GameInvitationController', () => {
  let controller: GameInvitationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameInvitationController],
      providers: [GameInvitationService],
    }).compile();

    controller = module.get<GameInvitationController>(GameInvitationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
