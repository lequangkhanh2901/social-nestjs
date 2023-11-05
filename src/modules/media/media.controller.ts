import {
  Controller,
  Get,
  Headers,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/core/guards/auth.guard'
import UsernameGuard from 'src/core/guards/username.guard'
import { QueryDto } from 'src/core/dto'
import { MediaService } from './media.service'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @UseGuards(UsernameGuard)
  @Get(':username/images')
  getImagesUser(
    @Param('username') username: string,
    @Headers() headers,
    @Query() query: QueryDto,
  ) {
    return this.mediaService.getImagesUsername(
      headers.authorization,
      username,
      query.limit,
      query.skip,
    )
  }

  @UseGuards(UsernameGuard)
  @Get(':username/videos')
  getVideosUser(
    @Headers() headers,
    @Param('username') username: string,
    @Query() query: QueryDto,
  ) {
    return this.mediaService.getVideosUsername(
      headers.authorization,
      username,
      query.limit,
      query.skip,
    )
  }
}
