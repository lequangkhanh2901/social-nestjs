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
import { CommentService } from './comment.service'
import { AddCommentDto } from './comment.dto'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(200)
  addComment(@Headers() headers, @Body() body: AddCommentDto) {
    return this.commentService.addComment(headers.authorization, body)
  }

  @Get(':postId')
  getPostComment(
    @Headers() headers,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.commentService.getCommentsPost(headers.authorization, postId)
  }
}
