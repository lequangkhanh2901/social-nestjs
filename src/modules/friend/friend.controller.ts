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
import { QueryFriendsDto } from './friend.dto'

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
    @Query() query: QueryFriendsDto,
  ) {
    return this.friendService.getFriendsUsername({
      authorization: headers.authorization,
      username,
      type: query.type || 'ALL',
      limit: query.limit,
      skip: query.skip,
      search: query.search,
    })
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
