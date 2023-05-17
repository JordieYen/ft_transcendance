import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@Post('create')
	createChannel(@Body() dto: CreateChatDto) {
		return this.chatService.createChannel(dto);
	}

	@Post('enter')
	enterChat() {
		return this.chatService.enterChannel();
	}
}
