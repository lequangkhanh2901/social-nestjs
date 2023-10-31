import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class QueryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  skip?: number

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumber()
  limit?: number
}
