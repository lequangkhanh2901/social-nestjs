import { ApiProperty } from '@nestjs/swagger'
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator'
import { ReportReason } from 'src/core/enums/report'

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
