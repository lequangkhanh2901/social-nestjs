import { Module } from '@nestjs/common'
import { LikeController } from './like.controller'
import { LikeService } from './like.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import Like from './like.entity'

@Module({
  controllers: [LikeController],
  providers: [LikeService],
  imports: [TypeOrmModule.forFeature([Like])],
})
export class LikeModule {}
