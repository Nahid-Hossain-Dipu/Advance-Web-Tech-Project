import {
    IsUUID,
    IsInt,
    Min,
    Max,
    IsOptional,
    IsString,
    MaxLength
} from "class-validator";

export class CreateRatingDto {

    @IsUUID()
    trip_id!: string;

    @IsUUID()
    ratee_id!: string;

    @IsInt()
    @Min(1)
    @Max(5)
    score!: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    comment?: string;

}