import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import { QueryDto } from 'src/core/dto'

export class QueryNotificationsDro extends QueryDto {
  @ApiProperty({
    enum: ['ALL', 'UNREAD'],
    required: false,
    description: 'ALL is default',
  })
  @IsEnum(['ALL', 'UNREAD'])
  @IsOptional()
  status?: 'ALL' | 'UNREAD'
}
