import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateStatDto {
    @IsNotEmpty()
    userId: number;

    @IsOptional()
    wins: number;

    @IsOptional()
    losses: number;

    @IsOptional()
    mmr: number;

    @IsOptional()
    totalGames: number;

    @IsOptional()
    winStreak: number;
}
