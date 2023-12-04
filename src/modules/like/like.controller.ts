import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { LikeDto } from './like.dto'
import { LikeService } from './like.service'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Get(':postId/users/post')
  getUsers(@Param('postId', ParseUUIDPipe) postId: string) {
    return this.likeService.getUsersLikePost(postId)
  }

  @Post()
  @HttpCode(200)
  like(@Headers() headers, @Body() body: LikeDto) {
    return this.likeService.like(headers.authorization, body.id, body.type)
  }
}
