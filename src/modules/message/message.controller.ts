import {
  Body,
  Controller,
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
import { mkdirSync } from 'fs'
import { extname } from 'path'
import { diskStorage } from 'multer'

import { AuthGuard } from 'src/core/guards/auth.guard'
import { QueryDto } from 'src/core/dto'
import { ResponseMessage } from 'src/core/enums/responseMessages.enum'
import generateKey from 'src/core/helper/generateKey'
import { MessageService } from './message.service'
import { CreateMessageDto } from './message.dto'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter(req, file, callback) {
        const filterType = /(jpg|jpeg|png|mp4|pdf)/
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
          if (extname(file.originalname) === '.pdf') {
            path = './public/other/messages'
          } else if (extname(file.originalname) === '.mp4') {
            path = './public/videos/messages'
          } else {
            path = './public/images/messages'
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
  async create(
    @Headers() headers,
    @Body() body: CreateMessageDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|mp4|pdf)/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    files: Express.Multer.File[],
  ) {
    return this.messageService.create(headers.authorization, body, files)
  }

  @Get(':conversationId/messages')
  getMessages(
    @Headers() headers,
    @Query() query: QueryDto,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.messageService.getMessages(
      headers.authorization,
      conversationId,
      query.limit || 20,
      query.skip || 0,
    )
  }

  @Put(':conversationId/read-all')
  readAll(
    @Headers() headers,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.messageService.readAll(headers.authorization, conversationId)
  }

  @Put(':messageId/read')
  read(
    @Headers() headers,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.messageService.read(headers.authorization, messageId)
  }

  @Put(':messageId/received')
  received(
    @Headers() headers,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.messageService.received(headers.authorization, messageId)
  }
}
