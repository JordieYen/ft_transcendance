import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get('id/:id')
  async findUsersById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUsersById(id);
  }

  @Get('username/:username')
  async findUsersByName(@Param('username') username: string) {
    return await this.userService.findUsersByName(username);
  }

  @Post('authenticate')
  async authenticateUser(@Query('uid') uid: string) {
    return await this.userService.authenticateUser(+uid);
  }

  @Post('create')
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: number) {
    try {
      await this.userService.deleteUserById(id);
      return {
        message: 'User with id ${id} has been deleted successfully',
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // https://cdn.intra.42.fr/users/da37eeb2b24561bdc86b9f906f448006/steh.jpg
  @Patch('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 4 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body('id', ParseIntPipe) id: number,
  ) {
    try {
      const avatarURL = `http://localhost:3000/public/avatar/${file.filename}`;
      await this.userService.uploadAvatar(id, avatarURL);
      return { message: 'Avatar upload successfully' };
    } catch (error) {
      throw new HttpException(
        'Error uploading avatar',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // use PUT for new request body, use PATCH if need request body contain only property changes only
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Get(':id')
  async getUserProfile(@Param('id') id: number) {
    return await this.userService.findUsersByIdWithRelation(id);
  }
}
