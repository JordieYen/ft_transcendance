import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { FriendStatus } from 'src/typeorm/friends.entity';

export class CreateFriendDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsNotEmpty()
  status: FriendStatus;

  @IsOptional()
  roomId: string;
}
