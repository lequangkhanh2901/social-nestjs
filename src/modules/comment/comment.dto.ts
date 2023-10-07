import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class AddCommentDto {
  @ApiProperty({
    type: 'string',
    format: 'UUID',
  })
  @IsUUID()
  id: string

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsString()
  content: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  parentId: number
}
