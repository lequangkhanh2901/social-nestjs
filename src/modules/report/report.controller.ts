import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/core/guards/auth.guard'
import { ReportService } from './report.service'
import { AddReportDto } from './report.dto'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('post')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  add(@Headers() headers, @Body() body: AddReportDto) {
    return this.reportService.add(headers.authorization, body)
  }
}
