import { IsEnum } from "class-validator";
import { ReportStatus } from "../entities/report.entity";

export class UpdateReportDto {

    @IsEnum(ReportStatus)
    status!: ReportStatus;
}