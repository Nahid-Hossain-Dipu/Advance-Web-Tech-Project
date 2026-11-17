import {
    IsUUID,
    IsString,
    IsOptional,
    MaxLength,
} from "class-validator";

import {
    ApiProperty,
    ApiPropertyOptional,
} from "@nestjs/swagger";

export class CreateReportDto {

    @ApiProperty({
        description: "UUID of the user being reported",
        example: "ba800983-76ba-44d7-a929-400553db6bf1",
    })
    @IsUUID()
    reported_user_id!: string;

    @ApiPropertyOptional({
        description: "UUID of the related trip (optional)",
        example: "f91dbb90-c9bd-4140-a5c4-a74b57908e68",
    })
    @IsOptional()
    @IsUUID()
    trip_id?: string;

    @ApiProperty({
        description: "Reason for submitting the report",
        example: "Inappropriate behavior",
        maxLength: 255,
    })
    @IsString()
    @MaxLength(255)
    reason!: string;

    @ApiPropertyOptional({
        description: "Additional details about the report",
        example: "The reported user behaved inappropriately during the trip.",
    })
    @IsOptional()
    @IsString()
    description?: string;
}