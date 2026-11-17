import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report, ReportStatus } from "./entities/report.entity";
import { CreateReportDto } from "./dto/create-report.dto";
import { UpdateReportDto } from "./dto/update-report.dto";

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>,
    ) {}

    async createReport(reporterId: string, dto: CreateReportDto) {
        if (reporterId === dto.reported_user_id) {
            throw new ForbiddenException("You cannot report yourself");
        }

        const report = this.reportRepository.create({
            ...dto,
            reporter_id: reporterId,
            status: ReportStatus.PENDING,
        });

        return await this.reportRepository.save(report);
    }

    async getAllReports(page: number = 1, limit: number = 10) {
        page = Math.max(1, page);
        limit = Math.max(1, Math.min(100, limit));

        const [reports, total] = await this.reportRepository.findAndCount({
            order: {
                created_at: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: reports,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getReportById(reportId: string) {
        const report = await this.reportRepository.findOne({
            where: {
                id: reportId,
            },
        });

        if (!report) {
            throw new NotFoundException("Report not found");
        }

        return report;
    }

    async updateReport(reportId: string, dto: UpdateReportDto) {
        const report = await this.reportRepository.findOne({
            where: {
                id: reportId,
            },
        });

        if (!report) {
            throw new NotFoundException("Report not found");
        }

        report.status = dto.status;

        return await this.reportRepository.save(report);
    }

    async deleteReport(reportId: string) {
        const report = await this.reportRepository.findOne({
            where: {
                id: reportId,
            },
        });

        if (!report) {
            throw new NotFoundException("Report not found");
        }

        await this.reportRepository.remove(report);

        return {
            message: "Report deleted successfully",
        };
    }
}