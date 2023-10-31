import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { Allow, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class AddCommentDto {
  @ApiProperty({
    type: 'string',
    format: 'UUID',
  })
  @IsUUID()
  @Allow()
  id: string

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  @Allow()
  content?: string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Allow()
  parentId: number

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  file?: any
}

export class DeleteCommentDto {
  @ApiProperty()
  @IsNumber()
  id: number
}
