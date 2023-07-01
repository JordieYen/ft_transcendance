import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';
import { User } from 'src/users/decorators/user.decorator';
import { CreateChannelUserDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('channel-user')
@Controller('channel-user')
export class ChannelUserController {
  constructor(private channelUserService: ChannelUserService) {}

  @Get()
  getAllChannelUsers() {
    return this.channelUserService.getAllChannelUsers();
  }

  @Get(':channeluser_id')
  findChannelUserById(
    @Param('channeluser_id', ParseIntPipe) channeluser_id: number,
  ) {
    return this.channelUserService.findChannelUserById(channeluser_id);
  }

  @Get('user/:user_id')
  findChannelUsersByUserId(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.channelUserService.findChannelUsersByUserId(user_id);
  }

  @Get('channel/:channel_id')
  findChannelUsersByChannelId(
    @Param('channel_id', ParseIntPipe) channel_id: number,
  ) {
    return this.channelUserService.findChannelUsersByChannelId(channel_id);
  }

  @Get('channeluser/:channel_id/:user_id')
  findChannelUserByChannelIdAndUserId(
    @Param('channel_id', ParseIntPipe) channel_id: number,
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    return this.channelUserService.findChannelUserByChannelIdAndUserId(
      channel_id,
      user_id,
    );
  }

  @Get('role/:user_id/:channel_id')
  getRoleOfUserByUserIdAndChannelId(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('channel_id', ParseIntPipe) channel_id: number,
  ) {
    console.log(user_id, channel_id);
    return this.channelUserService.getRoleOfUserByUserIdAndChannelId(
      user_id,
      channel_id,
    );
  }

  @Get('mute/:user_id/:channel_id')
  getMutedOfUserByUserIdAndChannelId(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('channel_id', ParseIntPipe) channel_id: number,
  ) {
    return this.channelUserService.getMutedOfUserByUserIdAndChannelId(
      user_id,
      channel_id,
    );
  }

  @Patch('mute/:user_id/:channel_id/:muted_days')
  updateMuteUserByUserIdAndChannelId(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('channel_id', ParseIntPipe) channel_id: number,
    @Param('muted_days', ParseIntPipe) muted_days: number,
    @User() user,
  ) {
    return this.channelUserService.updateMuteUserByUserIdAndChannelId(
      user_id,
      channel_id,
      muted_days,
      user,
    );
  }

  @Patch('mute/:user_id/:channel_id')
  unmuteUserByUserIdAndChannelId(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('channel_id', ParseIntPipe) channel_id: number,
  ) {
    return this.channelUserService.unmuteUserByUserIdAndChannelId(
      user_id,
      channel_id,
    );
  }

  @Post('create')
  createChannelUser(@Body() dto: CreateChannelUserDto, @User() user) {
    return this.channelUserService.createChannelUser(dto, user);
  }

  @Patch('status/:status/:user_id/:channel_id')
  updateStatus(
    @Param('status') status: string,
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('channel_id', ParseIntPipe) channel_id: number,
    @User() user,
  ) {
    return this.channelUserService.updateStatus(
      status,
      user_id,
      channel_id,
      user,
    );
  }

  @Patch('role/:role/:user_id/:channel_id')
  updateRole(
    @Param('role') role: string,
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('channel_id', ParseIntPipe) channel_id: number,
    @User() user,
  ) {
    return this.channelUserService.updateRole(role, user_id, channel_id, user);
  }

  @Delete('channeluser/:channeluser_id')
  deleteChannelUserById(
    @Param('channeluser_id', ParseIntPipe) channeluser_uid: number,
  ) {
    return this.channelUserService.deleteChannelUserById(channeluser_uid);
  }

  @Delete('channel/:channel_id')
  deleteAllChannelUsersByChannelId(
    @Param('channel_id', ParseIntPipe) channel_uid: number,
  ) {
    return this.channelUserService.deleteAllChannelUsersByChannelId(
      channel_uid,
    );
  }

  @Delete('channeluser/:channel_id/:user_id')
  deleteAllChannelUserByChannelIdAndUserId(
    @Param('channel_id', ParseIntPipe) channel_uid: number,
    @Param('user_id', ParseIntPipe) user_id: number,
  ) {
    return this.channelUserService.deleteAllChannelUserByChannelIdAndUserId(
      channel_uid,
      user_id,
    );
  }

  @Get('test/:test')
  test(@Param('test', ParseIntPipe) test: number) {
    return this.channelUserService.test(test);
  }
}
