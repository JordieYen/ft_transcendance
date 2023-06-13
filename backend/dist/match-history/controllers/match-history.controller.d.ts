import { MatchHistoryService } from '../services/match-history.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { MatchHistory } from 'src/typeorm/match_history.entity';
export declare class MatchHistoryController {
    private readonly matchHistoryService;
    constructor(matchHistoryService: MatchHistoryService);
    getHistory(): Promise<MatchHistory[]>;
    getByMatchUid(uid: string): Promise<MatchHistory[]>;
    getByPlayerUid(uid: string): Promise<MatchHistory[]>;
    getByScore(score: string): Promise<MatchHistory[]>;
    getTotalGamesByPlayerUid(uid: string): Promise<number>;
    getTotalWinsByPlayerUid(uid: string): Promise<number>;
    getTotalLossByPlayerUid(uid: string): Promise<number>;
    getMmrsByPlayerUid(uid: string): Promise<number>;
    create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void>;
    remove(uid: string): Promise<{
        message: string;
    }>;
}
