import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
    Query,
    ParseIntPipe,
    DefaultValuePipe,
    ParseUUIDPipe,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../../common/guard/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";
import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";

@Controller("reports")
@UseGuards(AuthGuard("jwt"))
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    createReport(@Req() req: any, @Body() dto: CreateReportDto) {
        return this.reportService.createReport(req.user.id, dto);
    }

    @Get()
    getAllReports(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.reportService.getAllReports(page, limit);
    }

    @Get(":id")
    getReportById(@Param("id", ParseUUIDPipe) id: string) {
        return this.reportService.getReportById(id);
    }

    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    updateReport(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() dto: UpdateReportDto,
    ) {
        return this.reportService.updateReport(id, dto);
    }

    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    deleteReport(@Param("id", ParseUUIDPipe) id: string) {
        return this.reportService.deleteReport(id);
    }
}