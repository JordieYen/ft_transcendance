// export class CreateMatchHistoryDto {
// 	match_uid : number;
// 	winner_uid : number;
// 	p1_uid : number;
// 	p2_uid : number;
// 	p1_score : number;
// 	p2_score : number;
// 	creation_date : Date;
// }

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
}
