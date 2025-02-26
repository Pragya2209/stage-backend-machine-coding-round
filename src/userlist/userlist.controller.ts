import { Controller, Post, Delete, Body, UsePipes, ValidationPipe, Query, Get, UseGuards } from '@nestjs/common';
import { UserContentListService } from './userlist.service';
import { UserContentListDto } from './dto/usercontentlist.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/auth';

@ApiTags('User List')
@UseGuards(AuthGuard)
@Controller('list')
export class UserContentListController {
  constructor(private readonly userListService: UserContentListService) {}

  @Get()
    async getContent(
        @Body('userId') userId: string,
        @Query('limit') limit: number = 10,
        @Query('offset') offset: number = 0,
    ) {
        return this.userListService.getContent(userId, limit, offset);
    }

  @Post()
  async addContent(@Body() addContentDto: UserContentListDto) {
    return this.userListService.addContent(addContentDto);
  }

  @Delete()
  async removeContent(@Body() removeContentDto: UserContentListDto) {
    return this.userListService.removeContent(removeContentDto);
  }
}