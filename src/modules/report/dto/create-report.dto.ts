import {
    IsUUID,
    IsString,
    IsOptional,
    MaxLength,
} from "class-validator";

export class CreateReportDto {

    @IsUUID()
    reported_user_id!: string;

    @IsOptional()
    @IsUUID()
    trip_id?: string;

    @IsString()
    @MaxLength(255)
    reason!: string;

    @IsOptional()
    @IsString()
    description?: string;
}