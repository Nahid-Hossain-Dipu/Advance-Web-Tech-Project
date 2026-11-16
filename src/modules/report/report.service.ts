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

    async getAllReports() {
        return await this.reportRepository.find({
            order: {
                created_at: "DESC",
            },
        });
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