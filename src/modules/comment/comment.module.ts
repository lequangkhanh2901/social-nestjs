import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { PostModule } from '../post/post.module'
import { MediaModule } from '../media/media.module'
import Comment from './comment.entity'
import { NotificationModule } from '../notification/notification.module'

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [
    TypeOrmModule.forFeature([Comment]),
    forwardRef(() => PostModule),
    forwardRef(() => MediaModule),
    forwardRef(() => NotificationModule),
  ],
})
export class CommentModule {}
