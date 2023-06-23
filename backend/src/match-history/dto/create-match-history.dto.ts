import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMatchHistoryDto {
  @IsNotEmpty()
  winner_uid: number;

  @IsNotEmpty()
  p1_uid: number;

  @IsNotEmpty()
  p2_uid: number;

  @IsOptional()
  p1_score: number;

  @IsOptional()
  p2_score: number;

  @IsOptional()
  p1_smashes: number;

  @IsOptional()
  p2_smashes: number;

  @IsOptional()
  p1_mmr: number;

  @IsOptional()
  p2_mmr: number;
}
