import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStatDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  user: number;

  @IsOptional()
  wins: number;

  @IsOptional()
  losses: number;

  @IsOptional()
  kills: number;

  @IsOptional()
  deaths: number;

  @IsOptional()
  smashes: number;

  @IsOptional()
  win_streak: number;

  @IsOptional()
  current_mmr: number;

  @IsOptional()
  best_mmr: number;
}
