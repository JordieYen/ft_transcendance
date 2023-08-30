import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChannelUserService } from 'src/chat/channel-user/channel-user.service';
import { ChannelService } from 'src/chat/channel/channel.service';
import { CreateChannelDto, JoinChannelDto } from 'src/chat/channel/dto';
import { User } from 'src/users/decorators/user.decorator';
import { UsersService } from 'src/users/services/users.service';

@WebSocketGateway({
  cors: {
    // origin: 'http://localhost:3001',
  },
})
export class ChannelGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly channelService: ChannelService,
    private readonly channelUserService: ChannelUserService,
    private readonly userService: UsersService,
  ) {}

  async onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id, 'channel socket connected');

      socket.on(
        'create-channel',
        async (channelName, channelType, channelPassword, userId) => {
          // console.log(channelName, channelType, channelPassword, userId);
          const user = await this.userService.findUsersById(userId);
          const dto: CreateChannelDto = {
            channel_name: channelName,
            channel_type: channelType,
            channel_hash: channelPassword,
          };
          const new_channel = await this.channelService.createChannel(
            dto,
            user,
          );
          // console.log(new_channel);
          this.server.emit('refresh-data');
          // this.server.emit('channel-created', new_channel);
        },
      );

      // socket.on('search-channel-type', async (channelType, userId) => {
      //   // console.log(channelType, userId);
      //   const user = await this.userService.findUsersById(userId);
      //   let channels =
      //     await this.channelService.findChannelsByChannelTypeWithId(
      //       channelType,
      //       userId,
      //     );
      //   if (channelType == 'all') {
      //     channels = await this.channelService.findPublicAndProtectedChannels(
      //       userId,
      //     );
      //   }
      //   // console.log(channels);
      //   this.server.emit('search-channels-complete', channels);
      // });

      // socket.on(
      //   'search-channel-with-name',
      //   async (channelType, channelName, userId) => {
      //     // console.log(channelType, userId);
      //     const user = await this.userService.findUsersById(userId);
      //     const channels = await this.channelService.searchChannels(
      //       channelType,
      //       channelName,
      //       userId,
      //     );
      //     // console.log(channels);
      //     this.server.emit('search-channels-complete', channels);
      //   },
      // );

      socket.on('join-channel', async (channelId, channelPassword, userId) => {
        const user = await this.userService.findUsersById(userId);
        const dto: JoinChannelDto = {
          channel_uid: channelId,
          channel_password: channelPassword,
        };
        const channel = this.channelService.findChannelById(channelId);
        try {
          await this.channelService.joinChannel(dto, user);
          // this.server.emit('join-channel-complete');
          this.server.emit('refresh-data');
          // this.server.emit('channel-created', channel);
        } catch (error) {
          console.log('error=', error.message);
        }
      });

      // socket.on(
      //   'search-channel-with-name-group',
      //   async (channelName, userId) => {
      //     // console.log(channelType, userId);
      //     const user = await this.userService.findUsersById(userId);
      //     const channels = await this.channelService.searchChannelsGroup(
      //       channelName,
      //       userId,
      //     );
      //     // console.log(channels);
      //     this.server.emit('search-channels-complete-group', channels);
      //   },
      // );

      socket.on('leave-channel', async (channelId, userId) => {
        const user = await this.userService.findUsersById(userId);
        const dto: JoinChannelDto = {
          channel_uid: channelId,
        };
        const channel = this.channelService.findChannelById(channelId);
        try {
          await this.channelService.leaveChannel(dto, user);
          // this.server.emit('join-channel-complete');
          // this.server.emit('channel-created', channel);
        } catch (error) {
          console.log('error=', error.message);
        }
        this.server.emit('refresh-data');
      });

      socket.on(
        'ban-from-channel',
        async (status, newUserId, channelId, userId) => {
          // console.log('?????', status);
          const user = await this.userService.findUsersById(userId);
          try {
            await this.channelUserService.updateStatus(
              status,
              newUserId,
              channelId,
              user,
            );
          } catch (error) {
            console.log('error=', error.message);
          }
          this.server.emit('refresh-data');
        },
      );

      socket.on('change-role', async (role, newUserId, channelId, userId) => {
        const user = await this.userService.findUsersById(userId);
        try {
          await this.channelUserService.updateRole(
            role,
            newUserId,
            channelId,
            user,
          );
        } catch (error) {
          console.log('error=', error.message);
        }
        this.server.emit('refresh-data');
      });

      socket.on(
        'mute-user',
        async (newUserId, channelId, mutedDays, userId) => {
          const user = await this.userService.findUsersById(userId);
          try {
            await this.channelUserService.updateMuteUserByUserIdAndChannelId(
              newUserId,
              channelId,
              mutedDays,
              user,
            );
            // this.server.emit('channel-created', channel);
          } catch (error) {
            console.log('error=', error.message);
          }
          this.server.emit('refresh-data');
        },
      );

      socket.on(
        'change-password',
        async (channelId, oldPassword, newPassword, userId) => {
          const user = await this.userService.findUsersById(userId);
          try {
            await this.channelService.changeChannelPassword(
              channelId,
              oldPassword,
              newPassword,
              user,
            );
            // this.server.emit('join-channel-complete');
            // this.server.emit('channel-created', channel);
          } catch (error) {
            console.log('error=', error.message);
          }
          this.server.emit('refresh-data');
        },
      );

      socket.on(
        'change-channel-type',
        async (channelId, newChanneltype, newPassword, userId) => {
          const user = await this.userService.findUsersById(userId);
          try {
            await this.channelService.changeChannelType(
              channelId,
              newChanneltype,
              newPassword,
              user,
            );
            // this.server.emit('join-channel-complete');
            // this.server.emit('channel-created', channel);
          } catch (error) {
            console.log('error=', error.message);
          }
          this.server.emit('refresh-data');
        },
      );
    });
  }
}
