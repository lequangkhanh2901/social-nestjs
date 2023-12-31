import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { mkdirSync } from 'fs'

import { AuthGuard } from 'src/core/guards/auth.guard'
import generateKey from 'src/core/helper/generateKey'
import { QueryDto } from 'src/core/dto'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import { PostService } from './post.service'
import {
  CreatePostDto,
  DeletePostDto,
  SharePostDto,
  UpdatePostDto,
  UpdateSharedPostDto,
} from './post.dto'
import UsernameGuard from 'src/core/guards/username.guard'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('medias', undefined, {
      fileFilter(req, file, callback) {
        const filterType = /(jpg|jpeg|png|mp4)/
        if (!extname(file.originalname).match(filterType)) {
          return callback(
            new HttpException(
              ResponseMessage.INVALID_FILE_TYPE,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          )
        }
        return callback(null, true)
      },
      storage: diskStorage({
        destination(req, file, callback) {
          let path = ''
          if (extname(file.originalname) === '.mp4') {
            path = './public/videos/posts'
          } else {
            path = './public/images/posts'
          }

          mkdirSync(path, { recursive: true })
          return callback(null, path)
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname)
          const fileName = `${Date.now()}-${generateKey(10)}${ext}`
          callback(null, fileName)
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  createPost(
    @Headers() headers,
    @Body() body: CreatePostDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|mp4)/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    medias: Express.Multer.File[],
  ) {
    return this.postService.createPost(headers.authorization, body, medias)
  }

  @Post('/share')
  sharePost(@Headers() headers, @Body() body: SharePostDto) {
    return this.postService.sharePost(headers.authorization, body)
  }

  @Get()
  getPosts(@Headers() headers, @Query() query: QueryDto) {
    return this.postService.getPosts(
      headers.authorization,
      query.limit,
      query.skip,
    )
  }

  @Get(':postId/get')
  getPost(@Headers() headers, @Param('postId', ParseUUIDPipe) postId: string) {
    return this.postService.getPost(headers.authorization, postId)
  }

  @UseGuards(UsernameGuard)
  @Get(':username')
  getPostsByUsername(
    @Headers() headers,
    @Query() query: QueryDto,
    @Param('username') username: string,
  ) {
    return this.postService.getPostsByUsername(
      headers.authorization,
      username,
      query.limit,
      query.skip,
    )
  }

  @Delete()
  deletePost(@Headers() headers, @Body() body: DeletePostDto) {
    return this.postService.deletePost(headers.authorization, body.id)
  }

  @Put()
  @UseInterceptors(
    FilesInterceptor('medias', undefined, {
      fileFilter(req, file, callback) {
        const filterType = /(jpg|jpeg|png|mp4)/
        if (!extname(file.originalname).match(filterType)) {
          return callback(
            new HttpException(
              ResponseMessage.INVALID_FILE_TYPE,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          )
        }
        return callback(null, true)
      },
      storage: diskStorage({
        destination(req, file, callback) {
          let path = ''
          if (extname(file.originalname) === '.mp4') {
            path = './public/videos/posts'
          } else {
            path = './public/images/posts'
          }

          mkdirSync(path, { recursive: true })
          return callback(null, path)
        },
        filename(req, file, callback) {
          const ext = extname(file.originalname)
          const fileName = `${Date.now()}-${generateKey(10)}${ext}`
          callback(null, fileName)
        },
      }),
    }),
  )
  @ApiConsumes('application/json')
  @ApiConsumes('multipart/form-data')
  updatePost(
    @Headers() headers,
    @Body() body: UpdatePostDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|mp4)/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    medias: Express.Multer.File[],
  ) {
    return this.postService.updatePost(headers.authorization, body, medias)
  }

  @Put('shared')
  updateSharedPost(@Headers() headers, @Body() body: UpdateSharedPostDto) {
    return this.postService.updateSharedPost(headers.authorization, body)
  }
}
