import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ParamsDto {
  @ApiProperty({
    description: 'user id',
  })
  @IsUUID()
  id: string
}
