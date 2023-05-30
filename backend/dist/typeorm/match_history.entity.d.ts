import { User } from './user.entity';
export declare class MatchHistory {
    match_uid: number;
    winner_uid: number;
    p1_uid: User;
    p2_uid: User;
    p1_score: number;
    p2_score: number;
    data_of_creation: Date;
}
