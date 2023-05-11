import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { MatchHistory } from 'src/typeorm/match_history.entity';
import { Repository } from 'typeorm';
export declare class MatchHistoryService {
    private matchHistoryRepository;
    constructor(matchHistoryRepository: Repository<MatchHistory>);
    getHistory(): Promise<MatchHistory[]>;
    getByMatchUid(uid: number): Promise<MatchHistory[] | MatchHistory>;
    getByPlayerUid(uid: number): Promise<MatchHistory[] | MatchHistory>;
    getByScore(score: number): Promise<MatchHistory[] | MatchHistory>;
    create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void>;
    remove(uid: number): Promise<void>;
}
