import {
  Controller,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { RequestFriendService } from './request-friend.service'

@UseGuards(AuthGuard)
@ApiTags('request-friend')
@ApiBearerAuth()
@Controller('request-friend')
export class RequestFriendController {
  constructor(private readonly requestFriendService: RequestFriendService) {}

  @Post(':uid')
  request(@Param('uid', ParseUUIDPipe) uid: string, @Headers() headers) {
    return this.requestFriendService.request(headers.authorization, uid)
  }
}
