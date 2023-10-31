import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserModule } from '../user/user.module'
import { FriendController } from './friend.controller'
import { FriendService } from './friend.service'
import Friend from './friend.entity'

@Module({
  controllers: [FriendController],
  providers: [FriendService],
  imports: [TypeOrmModule.forFeature([Friend]), forwardRef(() => UserModule)],
  exports: [FriendService],
})
export class FriendModule {}
