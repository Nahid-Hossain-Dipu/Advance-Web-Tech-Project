import {
    IsUUID,
    IsInt,
    Min,
    Max,
    IsOptional,
    IsString,
    MaxLength,
} from "class-validator";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateRatingDto {

    @ApiProperty({
        description: "UUID of the trip being rated",
        example: "f91dbb90-c9bd-4140-a5c4-a74b57908e68",
    })
    @IsUUID()
    trip_id!: string;

    @ApiProperty({
        description: "UUID of the user receiving the rating",
        example: "ba800983-76ba-44d7-a929-400553db6bf1",
    })
    @IsUUID()
    ratee_id!: string;

    @ApiProperty({
        description: "Rating score between 1 and 5",
        example: 5,
        minimum: 1,
        maximum: 5,
    })
    @IsInt()
    @Min(1)
    @Max(5)
    score!: number;

    @ApiPropertyOptional({
        description: "Optional comment about the user",
        example: "Very friendly and punctual passenger.",
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    comment?: string;
}