import { Type } from "class-transformer";
import {
    IsDateString,
    IsInt,
    IsNumber,
    IsOptional,
    IsPositive,
    IsUUID,
    Matches,
    Max,
    Min,
} from "class-validator";

export class CreateTripDto {
    @IsUUID()
    vehicle_id!: string;

    @IsUUID()
    pickup_area_id!: string;

    @IsUUID()
    destination_area_id!: string;

    @IsDateString()
    departure_time!: string;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Max(1000)
    distance_km!: number;

    @IsInt()
    @Min(1)
    @Max(8)
    seats_total!: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10000)
    cost_per_seat?: number;
}

export class UpdateTripDto {
    @IsOptional()
    @IsUUID()
    pickup_area_id?: string;

    @IsOptional()
    @IsUUID()
    destination_area_id?: string;

    @IsOptional()
    @IsDateString()
    departure_time?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    @Max(1000)
    distance_km?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10000)
    cost_per_seat?: number;
}

export class SearchTripDto {
    @IsOptional()
    @IsUUID()
    pickup_area_id?: string;

    @IsOptional()
    @IsUUID()
    destination_area_id?: string;

    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "date must be in YYYY-MM-DD format" })
    date?: string;

    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "time_from must be in HH:mm format" })
    time_from?: string;

    @IsOptional()
    @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: "time_to must be in HH:mm format" })
    time_to?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    offset?: number;
}