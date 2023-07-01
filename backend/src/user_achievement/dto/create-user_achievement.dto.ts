import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserAchievementDto {
  @IsNotEmpty()
  @IsNumber()
  user: number;

  @IsNotEmpty()
  @IsNumber()
  achievement: number;
}
