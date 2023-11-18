import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { mkdirSync } from 'fs'
import { extname } from 'path'

import { AuthGuard } from 'src/core/guards/auth.guard'
import generateKey from 'src/core/helper/generateKey'
import { QueryDto } from 'src/core/dto'
import { ConversationService } from './conversation.service'
import {
  AddUserDto,
  CreateGroupDto,
  FindForInviteQuery,
  KickUserDto,
  UpdateConversationDto,
  UpdateRoleDto,
} from './conversation.dto'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('all')
  getConversations(@Headers() headers) {
    return this.conversationService.getAll(headers.authorization)
  }

  @Get(':userId/start')
  getWithUser(
    @Headers() headers,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.conversationService.getWithUser(headers.authorization, userId)
  }

  @Get(':conversationId/info')
  getConversation(
    @Headers() headers,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationService.getInfo(
      headers.authorization,
      conversationId,
    )
  }

  @Post('create-group')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination(req, file, callback) {
          const path = './public/images/conversations'
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
  @ApiConsumes('multipart/form-data')
  createGroup(
    @Headers() headers,
    @Body() body: CreateGroupDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)/,
        })
        .build({
          fileIsRequired: true,
        }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.conversationService.createGroup(
      headers.authorization,
      body,
      avatar,
    )
  }

  @Get(':conversationId/members')
  getMembers(
    @Headers() headers,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationService.getMembers(
      headers.authorization,
      conversationId,
    )
  }

  @ApiConsumes('multipart/form-data')
  @ApiConsumes('application/json')
  @Put('update')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination(req, file, callback) {
          const path = './public/images/conversations'
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
  updateConversation(
    @Headers() headers,
    @Body() body: UpdateConversationDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)/,
        })
        .build({
          fileIsRequired: false,
        }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.conversationService.update(headers.authorization, body, avatar)
  }

  @Get(':conversationId/find-for-invite')
  findForInvite(
    @Headers() header,
    @Query() query: FindForInviteQuery,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationService.findForInvite(
      header.authorization,
      conversationId,
      query.name,
      query.skip || 0,
      query.limit || 10,
    )
  }

  @Post('add-user')
  addUser(@Headers() headers, @Body() body: AddUserDto) {
    return this.conversationService.addUser(headers.authorization, body)
  }

  @Delete('kick-user')
  kickUser(@Headers() headers, @Body() body: KickUserDto) {
    return this.conversationService.kickUser(headers.authorization, body)
  }

  @Put(':conversationId/quit-group')
  quitGroup(
    @Headers() headers,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationService.quitGroup(
      headers.authorization,
      conversationId,
    )
  }

  @Put('update-role')
  updateRole(@Headers() headers, @Body() body: UpdateRoleDto) {
    return this.conversationService.updateRole(headers.authorization, body)
  }

  @Put(':conversationId/read-last-group')
  readLastGroup(
    @Headers() headers,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
  ) {
    return this.conversationService.readLastGroup(
      headers.authorization,
      conversationId,
    )
  }

  @Get(':conversationId/medias')
  getMedias(
    @Headers() headers,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Query() query: QueryDto,
  ) {
    return this.conversationService.getMedias(
      headers.authorization,
      conversationId,
      query.skip || 0,
      query.limit || 10,
    )
  }
}
