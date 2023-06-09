import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FriendService } from '../services/friend.service';
import { CreateFriendDto } from '../dto/create-friend.dto';
import { UpdateFriendDto } from '../dto/update-friend.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('friend')
@ApiTags('Friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  create(@Body() createFriendDto: CreateFriendDto) {
    return this.friendService.create(createFriendDto);
  }

  @Get()
  findAll() {
    return this.friendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.friendService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFriendDto: Partial<UpdateFriendDto>) {
    return this.friendService.update(id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(+id);
  }

  @Post('friend-request/:senderId/:receiverId')
  sendFriendRequest(@Param('senderId') senderId: number, @Param('receiverId') receiverId: number) {
    return this.friendService.sendFriendRequest(senderId, receiverId);
  }

  @Post('accept-friend-request/:friendRequestId')
  acceptFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.acceptFriendRequest(friendRequestId);
  }

  @Post('decline-friend-request/:friendRequestId')
  declineFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.declineFriendRequest(friendRequestId);
  }

  @Post('cancel-friend-request/:friendRequestId')
  cancelFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.cancelFriendRequest(friendRequestId);
  }

  @Get('sent/:senderId')
  getSentFriendRequest(@Param('senderId') senderId: number) {
    return this.friendService.getSentFriendRequest(senderId);
  }

  @Get('received/:receiverId')
  getReceivedFriendRequest(@Param('receiverId') receiverId: number) {
    return this.friendService.getReceivedFriendRequest(receiverId);
  }

  @Post('webhook/friend-request')
  handleFriendRequestWebhook(@Body() body: any) {
    return this.friendService.handleFriendRequestWebhook(body);
  }

  @Get('friend-requests/:userId')
  getFriendRequests(@Param('userId') userId: number) {
    return this.friendService.getFriendRequests(userId);
  }

  @Delete('delete-all/:id')
  deleteAll() {
    return this.friendService.deleteAll();
  }


}
