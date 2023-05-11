import { Injectable, Options } from '@nestjs/common';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>,
  ) {}

  // Return All Entries
  async getHistory(): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find();
  }

  // Return entries with {match_uid}
  async getByMatchUid(uid: number): Promise<MatchHistory[] | MatchHistory> {
    return await this.matchHistoryRepository.find({
      where: {
        match_uid: uid
      }
    });
  }

  // Return entries with {user_uid}
  async getByPlayerUid(uid: number): Promise<MatchHistory[] | MatchHistory> {
    return await this.matchHistoryRepository.find({
      where: [
        {winner_uid: uid},
        {p1_uid: uid},
        {p2_uid: uid}
      ]
    });
  }
  
  // Return entries with {score}
  async getByScore(score: number): Promise<MatchHistory[] | MatchHistory> {
    return await this.matchHistoryRepository.find({
      where: [
        {p1_score: score},
        {p2_score: score}
      ]
    });
  }

  // Add new entry
  async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    await this.matchHistoryRepository.save(createMatchHistoryDto);
  }

  async remove(uid: number): Promise<void> {

  }
}
