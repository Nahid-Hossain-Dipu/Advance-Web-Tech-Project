import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateAreaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name!: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class UpdateAreaDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}