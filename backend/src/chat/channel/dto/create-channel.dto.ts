import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  channel_name: string;

  @IsString()
  @IsNotEmpty()
  channel_type: string;

  @IsString()
  @IsOptional()
  channel_hash?: string;
}
