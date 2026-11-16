import { IsDateString, IsInt, IsNumber, IsOptional, IsPositive, IsUUID, Max, Min } from "class-validator";

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