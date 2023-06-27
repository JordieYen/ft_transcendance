import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class JoinChannelDto {
  @IsNotEmpty()
  @IsNumber()
  channel_uid: number;

  @IsString()
  @IsOptional()
  channel_password?: string;
}
