import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ReportController } from './report.controller'
import { ReportService } from './report.service'
import { Report } from './report.entity'
import { PostModule } from '../post/post.module'
import { CommentModule } from '../comment/comment.module'
import { UserModule } from '../user/user.module'

@Module({
  controllers: [ReportController],
  providers: [ReportService],
  imports: [
    TypeOrmModule.forFeature([Report]),
    forwardRef(() => PostModule),
    forwardRef(() => CommentModule),
    forwardRef(() => UserModule),
  ],
})
export class ReportModule {}
