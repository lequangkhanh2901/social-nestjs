import { Module } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { User } from '../user/user.entity'
import Post from './post.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [TypeOrmModule.forFeature([User, Post])],
  exports: [PostService],
})
export class PostModule {}
