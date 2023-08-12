import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto, JoinChannelDto } from './dto';
import { User } from 'src/users/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('channel')
@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get()
  getAllChannels() {
    return this.channelService.getAllChannels();
  }

  @Get('id/:channel_id')
  findChannelById(@Param('channel_id', ParseIntPipe) channel_id: number) {
    return this.channelService.findChannelById(channel_id);
  }

  @Get('userid/:user_id')
  findChannelsByUserId(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.channelService.findChannelsByUserId(user_id);
  }

  @Get('type/:channel_type')
  findChannelsByChannelType(@Param('channel_type') channel_type: string) {
    return this.channelService.findChannelsByChannelType(channel_type);
  }

  @Get('typeid/:channel_type')
  findChannelsByChannelTypeWithId(
    @Param('channel_type') channel_type: string,
    @User() user,
  ) {
    return this.channelService.findChannelsByChannelTypeWithId(
      channel_type,
      user.id,
    );
  }

  @Get('typeall')
  findPublicAndProtectedChannels(@User() user) {
    return this.channelService.findPublicAndProtectedChannels(user.id);
  }

  @Get('typesearch/:channel_type/:name')
  searchChannels(
    @Param('channel_type') channel_type: string,
    @Param('name') name: string,
    @User() user,
  ) {
    return this.channelService.searchChannels(channel_type, name, user.id);
  }

  @Get('searchgroup/:name')
  searchChannelsGroup(@Param('name') name: string, @User() user) {
    return this.channelService.searchChannelsGroup(name, user.id);
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

  @Post('user/leave')
  // fix : dto should not be from body
  leaveChannel(@Body() dto: JoinChannelDto, @User() user) {
    return this.channelService.leaveChannel(dto, user);
  }

  @Delete(':id')
  deleteChannel(@Param('id', ParseIntPipe) channel_uid: number, @User() user) {
    return this.channelService.deleteChannel(channel_uid, user);
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
