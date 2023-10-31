import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'
import { diskStorage } from 'multer'
import { mkdirSync } from 'fs'

import { AuthGuard } from 'src/core/guards/auth.guard'
import generateKey from 'src/core/helper/generateKey'
import { RolesGuard } from 'src/core/guards/roles.guard'
import { Roles } from 'src/core/decorators/roles.decorator'
import { UserRoles } from 'src/core/enums/user'

import { UserService } from './user.service'
import {
  CreateUserDto,
  GetUserParams,
  UpdatePasswordDto,
  UpdateUserDto,
  UploadAvatarDto,
} from './user.dto'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post()
  // addUser(@Body() createUser: CreateUserDto) {
  //   return this.userService.addUser(createUser)
  // }

  @Get()
  getMe(@Headers() headers) {
    return this.userService.getMe(headers.authorization)
  }

  @Put('password')
  updatePassword(@Headers() headers, @Body() body: UpdatePasswordDto) {
    return this.userService.handleUpdatePassword(headers.authorization, body)
  }

  @Put()
  updateUser(@Headers() headers, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(headers.authorization, body)
  }

  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          mkdirSync('./public/images/', { recursive: true })
          return callback(null, './public/images/')
        },
        filename: (req, file, callback) => {
          const ext = extname(file.originalname)
          const fileName = `${Date.now()}-${generateKey(10)}${ext}`
          callback(null, fileName)
        },
      }),
    }),
  )
  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  uploadAvatar(
    @Headers() headers,
    @Body() body: UploadAvatarDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build(),
    )
    avatar: Express.Multer.File,
  ) {
    return this.userService.uploadAvatar(headers.authorization, avatar)
  }

  @Get(':username')
  getByUsername(@Headers() headers, @Param() params: GetUserParams) {
    return this.userService.getByUsername(
      headers.authorization,
      params.username,
    )
  }

  @ApiOperation({
    summary: 'Create account by admin',
  })
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  createAccount(@Body() body: CreateUserDto) {
    return this.userService.createAccount(body)
  }
}
