import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Options } from '@nestjs/common';
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
  async getByMatchUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: {
        match_uid: uid
      }
    });
  }

  // Return entries with {user_uid}
  async getByPlayerUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: [
        {winner_uid: uid},
        {p1_uid: uid},
        {p2_uid: uid}
      ]
    });
  }
  
  // Return entries with {score}
  async getByScore(score: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: [
        {p1_score: score},
        {p2_score: score}
      ]
    });
  }

  // Add new entry
  async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    const newMatch = this.matchHistoryRepository.create(createMatchHistoryDto);
    console.log(newMatch);
    try {
      await this.matchHistoryRepository.save(createMatchHistoryDto);
    } catch (error) {
      console.log('error=', error.message);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  // Delete an entry
  async remove(uid: number) {
    try {
      await this.matchHistoryRepository.delete(uid);
      return {message: 'User with uid ${uid} has been deleted successfully'};
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
