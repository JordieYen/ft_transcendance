import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from 'src/typeorm/stats.entity';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { CreateStatDto } from '../dto/create-stat.dto';
import { UpdateStatDto } from '../dto/update-stat.dto';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat) private statRepository: Repository<Stat>,
    private readonly userService: UsersService,
  ) {}
  async create(createStatDto: CreateStatDto) {
    const user = await this.userService.findUsersById(createStatDto.userId);
    const newStat = new Stat();
    newStat.user = user;
    newStat.wins = createStatDto.wins;
    newStat.losses = createStatDto.losses;
    newStat.mmr = createStatDto.mmr;
    const stat = await this.statRepository.create(newStat);
    try {
      return await this.statRepository.save(stat);
    } catch (error) {
      throw new InternalServerErrorException('Could not create new stat');
    }
  }

  async findAll() : Promise<Stat[]> {
    const stat =  await this.statRepository.find({
      relations: [ 'user' ]
    });
    return stat;
  }

  async findOne(id: number) {
    return await `This action returns a #${id} stat`;
  }

  async update(id: number, updateStatDto: UpdateStatDto) {
    return await `This action updates a #${id} stat`;
  }

  async remove(id: number) {
    return await this.statRepository.delete(id);
  }
}
