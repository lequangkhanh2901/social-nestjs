import { Module, forwardRef } from '@nestjs/common'
import { PostController } from './post.controller'
import { PostService } from './post.service'
import { User } from '../user/user.entity'
import Post from './post.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FriendModule } from '../friend/friend.module'
import { UserModule } from '../user/user.module'
import { MediaModule } from '../media/media.module'

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    forwardRef(() => FriendModule),
    forwardRef(() => UserModule),
    forwardRef(() => MediaModule),
  ],
  exports: [PostService],
})
export class PostModule {}
