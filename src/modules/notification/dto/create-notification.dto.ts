import {
    IsNotEmpty,
    IsString,
    IsUUID,
    MaxLength,
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateNotificationDto {

    @ApiProperty({
        description: "UUID of the user who will receive the notification",
        example: "ba800983-76ba-44d7-a929-400553db6bf1",
    })
    @IsUUID()
    user_id!: string;

    @ApiProperty({
        description: "Title of the notification",
        example: "Booking Confirmed",
        maxLength: 150,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title!: string;

    @ApiProperty({
        description: "Notification message",
        example: "Your booking has been confirmed successfully.",
    })
    @IsString()
    @IsNotEmpty()
    message!: string;
}