import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator'
import { AcceptAction, ReportReason } from 'src/core/enums/report'

export class AddReportDto {
  @ApiProperty({
    required: false,
  })
  @IsUUID()
  @IsOptional()
  postId?: string

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  commentId?: number

  @ApiProperty({
    enum: ReportReason,
  })
  @IsEnum(ReportReason)
  reason: ReportReason

  @ApiProperty({
    required: false,
    maxLength: 200,
  })
  @Length(0, 200)
  @IsString()
  @IsOptional()
  note?: string
}

export class AcceptActionDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'enum',
      enum: Object.values(AcceptAction),
    },
  })
  @IsArray()
  @IsEnum(AcceptAction, {
    each: true,
  })
  actions: AcceptAction[]
}
