import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { mkdirSync } from 'fs'
import { extname } from 'path'

import { AddCommentDto, DeleteCommentDto } from './comment.dto'
import generateKey from 'src/core/helper/generateKey'
import { AuthGuard } from 'src/core/guards/auth.guard'
import { CommentService } from './comment.service'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination(req, file, callback) {
          let path = ''
          if (extname(file.originalname) === '.mp4') {
            path = './public/videos/comments'
          } else {
            path = './public/images/comments'
          }
          mkdirSync(path, { recursive: true })
          callback(null, path)
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname)
          const fileName = `${Date.now()}-${generateKey(10)}${ext}`
          callback(null, fileName)
        },
      }),
    }),
  )
  @HttpCode(200)
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  addComment(
    @Headers() headers,
    @Body() body: AddCommentDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|mp4)/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.commentService.addComment(headers.authorization, body, file)
  }

  @Get(':postId')
  getPostComment(
    @Headers() headers,
    @Param('postId', ParseUUIDPipe) postId: string,
  ) {
    return this.commentService.getCommentsPost(headers.authorization, postId)
  }

  @Delete()
  deleteComment(@Headers() headers, @Body() body: DeleteCommentDto) {
    return this.commentService.deleteComment(headers.authorization, body.id)
  }
}
