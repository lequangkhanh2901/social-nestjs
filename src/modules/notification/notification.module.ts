import { Global, Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FriendModule } from '../friend/friend.module'
import { UserModule } from '../user/user.module'
import { PostModule } from '../post/post.module'
import Notification from './notification.entity'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'

@Global()
@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => FriendModule),
    forwardRef(() => PostModule),
    TypeOrmModule.forFeature([Notification]),
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
