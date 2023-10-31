import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { QueryDto } from 'src/core/dto'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { FriendService } from './friend.service'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('friend')
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get(':username')
  getFriendsUser(
    @Headers() headers,
    @Param('username') username: string,
    @Query() query: QueryDto,
  ) {
    return this.friendService.getFriendsUsername(
      headers.authorization,
      username,
      query.limit,
      query.skip,
    )
  }

  @Get()
  getMyFriends(@Headers() headers, @Query() query: QueryDto) {
    return this.friendService.getMyFriends(
      headers.authorization,
      query.limit,
      query.skip,
    )
  }
}
