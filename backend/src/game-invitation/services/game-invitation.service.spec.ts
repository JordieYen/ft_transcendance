import { Test, TestingModule } from '@nestjs/testing';
import { GameInvitationService } from './game-invitation.service';

describe('GameInvitationService', () => {
  let service: GameInvitationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInvitationService],
    }).compile();

    service = module.get<GameInvitationService>(GameInvitationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
