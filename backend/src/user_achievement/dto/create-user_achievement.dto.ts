import { IsNotEmpty, IsNumber, isNumber } from 'class-validator';

export class CreateUserAchievementDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  achievementId: number;
}
