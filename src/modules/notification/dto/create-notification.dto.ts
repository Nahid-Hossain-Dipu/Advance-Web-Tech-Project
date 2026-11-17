import {
    IsNotEmpty,
    IsString,
    IsUUID,
    MaxLength,
} from "class-validator";

export class CreateNotificationDto {
    @IsUUID()
    user_id!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;
}