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
    Post,
    UploadedFile,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { promises as fsPromises } from 'fs';

const { rename } = fsPromises;

@Controller('users')
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
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: 'image/jpeg' })
      // .addMaxSizeValidator({ maxSize: 100000 })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      }),
  ) file: Express.Multer.File, @Body('id') id: number) {
    console.log('file', file);
    console.log('path', file.filename);
    console.log('id', id);
    console.log('path', join(process.cwd(), file.originalname));

    try {
      const destinationPath = join(process.cwd(), 'upload', file.originalname);
      await rename(file.path, destinationPath);
      const avatarPath = destinationPath;

      console.log('avatar path', avatarPath);
      
      await this.userService.uploadAvatar(id, avatarPath);
      return { message: 'Avatar upload successfully' };
    } catch (error) {
      throw new HttpException(
        'Error uploading avatar',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

}
