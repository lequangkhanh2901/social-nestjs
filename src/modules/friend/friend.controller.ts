import { Controller, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from 'src/core/guards/auth.guard'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('friend')
@Controller('friend')
export class FriendController {}
