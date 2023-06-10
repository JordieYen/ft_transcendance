import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';
import { User } from 'src/users/decorators/user.decorator';
import { CreateMessageDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('message')
@Controller('message')
export class MessageController {
	constructor (private messageService: MessageService) {}

	// @Get()
	// test() {
	// 	return this.messageService.test();
	// }

	@Get()
	getAllMessages() {
		return this.messageService.getAllMessages();
	}

	@Post('create')
	createMessage(@Body() dto: CreateMessageDto, @User() sender) {
		return this.messageService.createMessage(dto, sender);
	}
}
