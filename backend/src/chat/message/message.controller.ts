import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { User } from 'src/users/decorators/user.decorator';
import { CreateMessageDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  // @Get()
  // test() {
  // 	return this.messageService.test();
  // }

  @Get()
  getAllMessages() {
    return this.messageService.getAllMessages();
  }

  @Get('id/:channel_id')
  findChannelById(@Param('channel_id', ParseIntPipe) channel_id: number) {
    return this.messageService.findMessagesById(channel_id);
  }

  @Post('create')
  createMessage(@Body() dto: CreateMessageDto, @User() sender) {
    return this.messageService.createMessage(dto, sender);
  }

  @Delete('delete-all/:id')
  deleteAll() {
    return this.messageService.deleteAllMesssages();
  }
}
