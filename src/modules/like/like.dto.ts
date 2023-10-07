import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { LikeType } from 'src/core/enums/common'

export class LikeDto {
  @ApiProperty({
    description: 'uuid',
  })
  @IsNotEmpty()
  id: string | number

  @ApiProperty({
    enum: LikeType,
  })
  @IsEnum(LikeType)
  type: LikeType
}
