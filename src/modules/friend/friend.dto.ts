import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { QueryDto } from 'src/core/dto'

export class QueryFriendsDto extends QueryDto {
  @ApiProperty({
    enum: ['ALL', 'SAME_FRIEND'],
    default: 'ALL',
    required: false,
  })
  @IsOptional()
  type?: 'ALL' | 'SAME_FRIEND'

  @ApiProperty({
    required: false,
    description: 'name or username',
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  search?: string
}

export class FriendsOfFriendsQueryDto extends QueryDto {
  @ApiProperty({
    required: false,
    description: 'name or username',
  })
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  excludeRequestFriend: boolean
}
