import { Test, TestingModule } from '@nestjs/testing';
import { StatController } from './stat.controller';
import { StatService } from '../services/stat.service';

describe('StatController', () => {
  let controller: StatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatController],
      providers: [StatService],
    }).compile();

    controller = module.get<StatController>(StatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
