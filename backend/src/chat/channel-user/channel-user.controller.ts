import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';
import { User } from 'src/users/decorators/user.decorator';
import { CreateChannelUserDto } from './dto';

@Controller('channel-user')
export class ChannelUserController {
	constructor(private channelUserService: ChannelUserService) {}

	@Get()
	getAllChannelUsers() {
		return this.channelUserService.getAllChannelUsers();
	}

	@Get(':channeluser_id')
	findChannelUserById(@Param('channeluser_id') channeluser_id: number) {
		return this.channelUserService.findChannelUserById(channeluser_id);
	}

	@Post('create')
	createChannelUser(@Body() dto: CreateChannelUserDto, @User() user) {
		return this.channelUserService.createChannelUser(dto, user);
	}

	@Delete(':channeluser_id')
	deleteChannelUserById(@Param('id') channeluser_uid: number) {
		return this.channelUserService.deleteChannelUserById(channeluser_uid);
	}

	@Delete(':channel_id')
	deleteAllChannelUsersByChannelId(@Param('id') channel_uid: number) {
		return this.channelUserService.deleteAllChannelUsersByChannelId(channel_uid);
	}
}
