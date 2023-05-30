import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/services/users.service';
export declare class MatchHistoryService {
    private matchHistoryRepository;
    private userService;
    constructor(matchHistoryRepository: Repository<MatchHistory>, userService: UsersService);
    getHistory(): Promise<MatchHistory[]>;
    getByMatchUid(uid: number): Promise<MatchHistory[]>;
    getByPlayerUid(uid: number): Promise<MatchHistory[]>;
    getByScore(score: number): Promise<MatchHistory[]>;
    getTotalGamesByPlayerUid(uid: number): Promise<number>;
    create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void>;
    remove(uid: number): Promise<{
        message: string;
    }>;
}
