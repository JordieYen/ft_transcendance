import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from 'src/typeorm/stats.entity';
import { Repository } from 'typeorm';

// api for total games and kdr

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat)
    private statRepository: Repository<Stat>
  ) {}
  
  // async findAll() : Promise<Stat[]> {
  //   const stat =  await this.statRepository.find({
  //     relations: [ 'user' ]
  //   });
  //   return stat;
  // }
  
  // async findOne(id: number) {
  //   const stat = await this.statRepository.findOne({
  //     relations: [ 'user'],
  //     where: {
  //       id: id,
  //     }
  //   })
  //   if (!stat)
  //   throw new NotFoundException(`Stat with ${id} is not found`);
  //   return stat;
  // }
  
  // async update(id: number, updateStatDto: UpdateStatDto) {
  //   const stat = await this.findOne(id);
  //   if (updateStatDto?.userId) {
  //     // const user = await this.userService.findUsersById(updateStatDto.userId);
  //     stat.userId = updateStatDto?.userId;
  //   }
  //   stat.wins = updateStatDto?.wins;
  //   stat.losses = updateStatDto?.losses;
  //   stat.mmr = updateStatDto?.mmr;
  //   return await this.statRepository.save(stat);
  // }

  // add new entry
  async create(createStatDto: CreateStatDto) {
    const newStat = await this.statRepository.create({
      uid: createStatDto.uid,
      wins: createStatDto.wins,
      losses: createStatDto.losses,
      kills: createStatDto.kills,
      deaths: createStatDto.deaths,
      smashes: createStatDto.smashes,
      winstreak: createStatDto.winstreak,
      current_mmr: createStatDto.current_mmr,
      best_mmr: createStatDto.best_mmr
    });
    console.log(newStat);
    try {
      await this.statRepository.save(newStat);
    } catch (error) {
      console.log('error=', error.message);
      throw new InternalServerErrorException('Could not create new stat');
    }
  }
  
  // Delete an entry
  async remove(uid: number) {
    try {
      await this.statRepository.delete(uid);
      return {message: 'Stat with uid ${uid} has been deleted successfully'};
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
