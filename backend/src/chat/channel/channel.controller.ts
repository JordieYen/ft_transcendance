import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto, JoinChannelDto } from './dto';
import { User } from 'src/users/decorators/user.decorator';

@Controller('channel')
export class ChannelController {
	constructor(private channelService: ChannelService) {}

	@Get()
	getAllChannels() {
		return this.channelService.getAllChannels();
	}

	@Get('id/:channel_id')
	findChannelById(@Param('channel_id') channel_id: number) {
		console.log('in');
		return this.channelService.findChannelById(channel_id);
	}

	@Get('type/:channel_type')
	findChannelsByChannelType(@Param('channel_type') channel_type: string) {
		console.log('in');
		return this.channelService.findChannelsByChannelType(channel_type);
	}

	@Post('create')
	createChannel(@Body() dto: CreateChannelDto, @User() user) {
		return this.channelService.createChannel(dto, user);
	}

	@Post('join')
	// fix : dto should not be from body
	joinChannel(@Body() dto: JoinChannelDto, @User() user) {
		return this.channelService.joinChannel(dto, user);
	}

	@Delete(':id')
	deleteChannel(@Param('id') channel_uid: number, @User() user) {
		return this.channelService.deleteChannel(channel_uid , user);
	}

	@Get('test')
	testChannel(@User() user) {
		return this.channelService.testChannel(user);
	}

	// @Get('user')
	// listChannelByUser(@User() user) {
	// 	return this.chatService.listChannelByUser(user);
	// }
}
