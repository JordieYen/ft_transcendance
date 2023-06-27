import { IsOptional } from 'class-validator';
import { Channel } from 'src/typeorm/channel.entity';
import { Role, Status } from 'src/typeorm/channel_user.entity';
import { User } from 'src/typeorm/user.entity';

export class CreateChannelUserDto {
  @IsOptional()
  role?: Role;

  @IsOptional()
  status?: Status;

  @IsOptional()
  user?: User;

  @IsOptional()
  channel?: Channel;
}
