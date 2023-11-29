import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthGuard } from 'src/core/guards/auth.guard'
import { RolesGuard } from 'src/core/guards/roles.guard'
import { Roles } from 'src/core/decorators/roles.decorator'
import { UserRoles } from 'src/core/enums/user'
import { QueryDto } from 'src/core/dto'

import { ReportService } from './report.service'
import { AcceptActionDto, AddReportDto } from './report.dto'

@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRoles.MANAGER)
  @Get()
  get(@Query() query: QueryDto) {
    return this.reportService.get(query.limit || 10, query.skip || 0)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.MANAGER)
  @Get('handled')
  getHandled(@Headers() headers, @Query() query: QueryDto) {
    return this.reportService.getHandled(
      headers.authorization,
      query.skip || 0,
      query.limit || 10,
    )
  }

  @Post()
  add(@Headers() headers, @Body() body: AddReportDto) {
    return this.reportService.add(headers.authorization, body)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.MANAGER)
  @Put(':reportId/reject')
  reject(
    @Headers() headers,
    @Param('reportId', ParseUUIDPipe) reportId: string,
  ) {
    return this.reportService.reject(headers.authorization, reportId)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.MANAGER)
  @Put(':reportId/accept')
  accept(
    @Headers() headers,
    @Body() body: AcceptActionDto,
    @Param('reportId', ParseUUIDPipe) reportId: string,
  ) {
    return this.reportService.accept(
      headers.authorization,
      reportId,
      body.actions,
      body.time,
    )
  }
}
