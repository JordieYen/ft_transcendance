import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  message_content: string;

  @IsString()
  @IsNotEmpty()
  message_type: string;

  @IsNotEmpty()
  @IsNumber()
  channel_id: number;
}
