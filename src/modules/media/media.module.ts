import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { MediaService } from './media.service'
import { MediaController } from './media.controller'
import Media from './media.entity'
import { UserModule } from '../user/user.module'

@Module({
  providers: [MediaService],
  controllers: [MediaController],
  imports: [TypeOrmModule.forFeature([Media]), forwardRef(() => UserModule)],
  exports: [MediaService],
})
export class MediaModule {}
