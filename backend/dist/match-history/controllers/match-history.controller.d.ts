import { MatchHistoryService } from '../services/match-history.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
export declare class MatchHistoryController {
    private readonly matchHistoryService;
    constructor(matchHistoryService: MatchHistoryService);
    getHistory(): Promise<import("../../typeorm/match_history.entity").MatchHistory[]>;
    getByMatchUid(uid: string): Promise<import("../../typeorm/match_history.entity").MatchHistory | import("../../typeorm/match_history.entity").MatchHistory[]>;
    getByPlayerUid(uid: string): Promise<import("../../typeorm/match_history.entity").MatchHistory | import("../../typeorm/match_history.entity").MatchHistory[]>;
    getByScore(score: string): Promise<import("../../typeorm/match_history.entity").MatchHistory | import("../../typeorm/match_history.entity").MatchHistory[]>;
    create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void>;
    remove(uid: string): Promise<void>;
}
