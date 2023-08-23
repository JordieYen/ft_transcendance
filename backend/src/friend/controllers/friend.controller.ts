import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
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
  update(@Param('id') id: number, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(id, updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(+id);
  }

  @Post('friend-request/:senderId/:receiverId')
  sendFriendRequest(
    @Param('senderId') senderId: number,
    @Param('receiverId') receiverId: number,
  ) {
    return this.friendService.sendFriendRequest(senderId, receiverId);
  }

  @Put('accept-friend-request/:friendRequestId')
  acceptFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.acceptFriendRequest(friendRequestId);
  }

  @Put('decline-friend-request/:friendRequestId')
  declineFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.declineFriendRequest(friendRequestId);
  }

  @Put('cancel-friend-request/:friendRequestId')
  cancelFriendRequest(@Param('friendRequestId') friendRequestId: number) {
    return this.friendService.unFriend(friendRequestId);
  }

  // @Put('block-user/:friendRequestId')
  // blockUser(@Param('friendRequestId') friendRequestId: number) {
  //   return this.friendService.blockUser(friendRequestId);
  // }

  @Put('block-user/:blockerId/:blockedUserId')
  blocker(
    @Param('blockerId') blockerId: number,
    @Param('blockedUserId') blockedUserId: number,
  ) {
    return this.friendService.blocker(blockerId, blockedUserId);
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
    // return this.friendService.getFriendRequests(userId);
    return this.friendService.getReceivedFriendRequest(userId);
  }

  @Delete('delete-all/:id')
  deleteAll() {
    return this.friendService.deleteAll();
  }

  @Get('friends/:userId')
  getFriends(@Param('userId') userId: number) {
    return this.friendService.getFriends(+userId);
  }

  @Get('blocked/:userId')
  getBlockedUsers(@Param('userId') userId: number) {
    console.log('userId', userId);
    return this.friendService.getBlockedUsers(+userId);
  }

  @Get('check-relationship/:userId/:friendId')
  isFriend(
    @Param('userId') userId: number,
    @Param('friendId') friendId: number,
  ) {
    return this.friendService.findFriendship(+userId, +friendId);
  }

  @Get('getGameStatus/:userId')
  getGameStatus(@Param('userId') userId: number) {
    return this.friendService.getGameStatus(userId);
  }
}
