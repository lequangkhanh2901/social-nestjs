import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  Allow,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'

class CreateConversationDataDto {
  @IsUUID()
  userId: string
}

enum MessaeType {
  CREATE = 'CREATE',
}

export class CreateMessageDto {
  @ApiProperty({
    required: false,
  })
  @IsUUID()
  @IsOptional()
  @Allow()
  conversationId: string

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Allow()
  content?: string

  @ApiProperty({
    required: false,
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  files?: any

  @ApiProperty({
    required: false,
    type: 'enum',
    enum: MessaeType,
  })
  @IsEnum(MessaeType)
  @Allow()
  @IsOptional()
  type?: MessaeType

  @ApiProperty({
    required: false,
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'uuid of target user',
      },
    },
  })
  @ValidateNested()
  @Type(() => CreateConversationDataDto)
  @IsOptional()
  createConversationData?: CreateConversationDataDto
}
