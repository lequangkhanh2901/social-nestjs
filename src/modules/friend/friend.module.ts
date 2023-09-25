import { Module } from '@nestjs/common'
import { FriendController } from './friend.controller'
import { FriendService } from './friend.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import Friend from './friend.entity'
import { UserModule } from '../user/user.module'

@Module({
  controllers: [FriendController],
  providers: [FriendService],
  imports: [TypeOrmModule.forFeature([Friend]), UserModule],
  exports: [FriendService],
})
export class FriendModule {}
