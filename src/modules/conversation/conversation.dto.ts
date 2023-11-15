import { ApiProperty } from '@nestjs/swagger'
import {
  Allow,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator'
import { QueryDto } from 'src/core/dto'
import { ConversationStatus } from 'src/core/enums/conversation'

export class CreateGroupDto {
  @ApiProperty({
    minLength: 4,
    maxLength: 30,
  })
  @Allow()
  @IsString()
  @Length(4, 30)
  name: string

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  avatar: any
}

export class UpdateConversationDto {
  @ApiProperty()
  @IsUUID()
  @Allow()
  id: string

  @ApiProperty({
    minLength: 4,
    maxLength: 30,
    required: false,
  })
  @Length(4, 30)
  @IsString()
  @IsOptional()
  @Allow()
  name?: string

  @ApiProperty({
    required: false,
    type: 'enum',
    enum: ConversationStatus,
  })
  @IsEnum(ConversationStatus)
  @Allow()
  @IsOptional()
  status?: ConversationStatus

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  avatar?: any
}

export class FindForInviteQuery extends QueryDto {
  @ApiProperty({})
  @IsString()
  name: string
}

export class AddUserDto {
  @ApiProperty()
  @IsUUID()
  id: string

  @ApiProperty()
  @IsUUID()
  userId: string
}
