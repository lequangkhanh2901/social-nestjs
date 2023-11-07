import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { PostModule } from '../post/post.module'
import { MediaModule } from '../media/media.module'
import Comment from './comment.entity'

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  imports: [PostModule, TypeOrmModule.forFeature([Comment]), MediaModule],
})
export class CommentModule {}
