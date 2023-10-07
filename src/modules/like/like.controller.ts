import {
  Body,
  Controller,
  Headers,
  HttpCode,
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

  @Post()
  @HttpCode(200)
  like(@Headers() headers, @Body() body: LikeDto) {
    return this.likeService.like(headers.authorization, body.id, body.type)
  }
}
