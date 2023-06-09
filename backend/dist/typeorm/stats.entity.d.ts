import { User } from './user.entity';
export declare class Stat {
    id: number;
    userId: number;
    user: User;
    wins: number;
    losses: number;
    mmr: number;
    total_games: number;
    winStreak: number;
}
