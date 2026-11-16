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
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
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
    getAllReports() {
        return this.reportService.getAllReports();
    }

    @Get(":id")
    getReportById(@Param("id") id: string) {
        return this.reportService.getReportById(id);
    }

    @Patch(":id")
    updateReport(
        @Param("id") id: string,
        @Body() dto: UpdateReportDto,
    ) {
        return this.reportService.updateReport(id, dto);
    }

    @Delete(":id")
    deleteReport(@Param("id") id: string) {
        return this.reportService.deleteReport(id);
    }
}