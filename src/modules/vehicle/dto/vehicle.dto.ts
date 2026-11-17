import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateVehicleDto {
    @IsIn(["car", "motorbike"])
    type!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    model!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    plate_no!: string;

    @IsInt()
    @Min(1)
    @Max(8)
    seat_capacity!: number;
}

export class UpdateVehicleDto {
    @IsOptional()
    @IsIn(["car", "motorbike"])
    type?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    model?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(30)
    plate_no?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(8)
    seat_capacity?: number;
}