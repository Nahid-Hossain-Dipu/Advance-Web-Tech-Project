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

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from "@nestjs/swagger";

import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../../common/guard/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { Role } from "../../common/enums/role.enum";

import { ReportService } from "./report.service";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";

@ApiTags("Report")
@ApiBearerAuth()
@Controller("reports")
@UseGuards(AuthGuard("jwt"))
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    // Create Report
    @Post()
    @ApiOperation({
        summary: "Create a new report",
        description: "Allows an authenticated user to submit a report.",
    })
    @ApiBody({ type: CreateReportDto })
    @ApiResponse({
        status: 201,
        description: "Report created successfully.",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized. JWT token is required.",
    })
    createReport(@Req() req: any, @Body() dto: CreateReportDto) {
        return this.reportService.createReport(req.user.id, dto);
    }

    // Get All Reports
    @Get()
    @ApiOperation({
        summary: "Get all reports",
        description: "Retrieve all reports with pagination.",
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        example: 1,
        description: "Page number.",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        example: 10,
        description: "Number of reports per page.",
    })
    @ApiResponse({
        status: 200,
        description: "Reports retrieved successfully.",
    })
    getAllReports(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.reportService.getAllReports(page, limit);
    }

    // Get Report By ID
    @Get(":id")
    @ApiOperation({
        summary: "Get report by ID",
        description: "Retrieve a specific report using its UUID.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "UUID of the report.",
    })
    @ApiResponse({
        status: 200,
        description: "Report retrieved successfully.",
    })
    @ApiResponse({
        status: 404,
        description: "Report not found.",
    })
    getReportById(@Param("id", ParseUUIDPipe) id: string) {
        return this.reportService.getReportById(id);
    }

    // Update Report (Admin Only)
    @Patch(":id")
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: "Update a report",
        description: "Only administrators can update reports.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "UUID of the report.",
    })
    @ApiBody({ type: UpdateReportDto })
    @ApiResponse({
        status: 200,
        description: "Report updated successfully.",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized.",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden. Admin role is required.",
    })
    @ApiResponse({
        status: 404,
        description: "Report not found.",
    })
    updateReport(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() dto: UpdateReportDto,
    ) {
        return this.reportService.updateReport(id, dto);
    }

    // Delete Report (Admin Only)
    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: "Delete a report",
        description: "Only administrators can delete reports.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "UUID of the report.",
    })
    @ApiResponse({
        status: 200,
        description: "Report deleted successfully.",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized.",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden. Admin role is required.",
    })
    @ApiResponse({
        status: 404,
        description: "Report not found.",
    })
    deleteReport(@Param("id", ParseUUIDPipe) id: string) {
        return this.reportService.deleteReport(id);
    }
}
