import {
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
  forwardRef,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/core/guards/auth.guard'
import { NotificationService } from './notification.service'
import { QueryNotificationsDro } from './notification.dto'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  getNotifications(@Headers() headers, @Query() query: QueryNotificationsDro) {
    return this.notificationService.getNotifications(
      headers.authorization,
      query.skip || 0,
      query.limit || 10,
      query.status,
    )
  }

  @Get(':notificationId/get')
  getNotification(
    @Headers() headers,
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.getNotification(
      headers.authorization,
      notificationId,
    )
  }

  @Put(':notificationId/read')
  readNotification(
    @Headers() headers,
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.readNotification(
      headers.authorization,
      notificationId,
    )
  }

  @Put('read-all')
  readAll(@Headers() headers) {
    return this.notificationService.readAll(headers.authorization)
  }

  @Delete(':notificationId/delete')
  deleteNotification(
    @Headers() headers,
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
  ) {
    return this.notificationService.deleteNotification(
      headers.authorization,
      notificationId,
    )
  }

  @Delete('delete-all')
  deleteAll(@Headers() headers) {
    return this.notificationService.deleteAll(headers.authorization)
  }
}
