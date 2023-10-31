import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { RequestFriendService } from './request-friend.service'
import { ParamsDto } from './request-friend.dto'

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

  @Get('receive')
  requestReceived(@Headers() headers) {
    return this.requestFriendService.received(headers.authorization)
  }

  @Get('sent')
  requestSent(@Headers() headers) {
    return this.requestFriendService.sent(headers.authorization)
  }

  @Put(':id')
  accept(@Param() params: ParamsDto, @Headers() headers) {
    return this.requestFriendService.accept(headers.authorization, params.id)
  }

  @Delete(':id')
  cancel(@Param() params: ParamsDto, @Headers() headers) {
    return this.requestFriendService.cancel(headers.authorization, params.id)
  }
}
