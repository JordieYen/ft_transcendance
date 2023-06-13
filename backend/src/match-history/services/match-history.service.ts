import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private matchHistoryRepository: Repository<MatchHistory>,
    private userService: UsersService
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

  // Return entries with {winner_uid}
  async getWinsByPlayerUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: {
        winner_uid: uid
      }
    });
  }

  // Return entries with {user_uid}
  async getByPlayerUid(uid: number): Promise<MatchHistory[]> {
    return await this.matchHistoryRepository.find({
      where: [
        {p1_uid: {id: uid}},
        {p2_uid: {id: uid}}
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

  // Return total games played from a player
  async getTotalGamesByPlayerUid(uid: number): Promise<number> {
    const total = (await this.getByPlayerUid(uid)).length;
    return (total);
  }

  // Return total wins from a player
  async getTotalWinsByPlayerUid(uid: number): Promise<number> {
    const total = (await this.getWinsByPlayerUid(uid)).length;
    return (total);
  }

  // Return total loss from a player
  async getTotalLossByPlayerUid(uid: number): Promise<number> {
    const totalMatches = await this.getTotalGamesByPlayerUid(uid);
    const totalWins = await this.getTotalWinsByPlayerUid(uid);
    const total = totalMatches - totalWins;
    return (total);
  }

  // Return MMR for a player
  async getMmrByPlayerUid(uid: number): Promise<number> {
    const totalWins = await this.getTotalWinsByPlayerUid(uid);
    const totalLoss = await this.getTotalLossByPlayerUid(uid);
    return (1000 + (totalWins * 10 - totalLoss * 5));
  }

  // Add new entry
  async create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void> {
    const newMatch = await this.matchHistoryRepository.create({
        winner_uid: createMatchHistoryDto.winner_uid,
        p1_uid: await this.userService.findUsersById(createMatchHistoryDto.p1_uid),
        p2_uid: await this.userService.findUsersById(createMatchHistoryDto.p2_uid),
        p1_score: createMatchHistoryDto.p1_score,
        p2_score: createMatchHistoryDto.p2_score
    });
    console.log(newMatch);
    try {
      await this.matchHistoryRepository.save(newMatch);
    } catch (error) {
      console.log('error=', error.message);
      throw new InternalServerErrorException('Could not create match-history');
    }
  }

  // Delete an entry
  async remove(uid: number) {
    try {
      await this.matchHistoryRepository.delete(uid);
      return {message: 'Match with uid ${uid} has been deleted successfully'};
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
