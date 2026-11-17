import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { NotificationService } from "./notification.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";

@Controller("notifications")
@UseGuards(AuthGuard("jwt"))
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    @Post()
    createNotification(@Body() dto: CreateNotificationDto) {
        return this.notificationService.createNotification(dto);
    }

    @Get()
    getAllNotifications() {
        return this.notificationService.getAllNotifications();
    }

    @Get("user/:userId")
    getNotificationsByUser(@Param("userId") userId: string) {
        return this.notificationService.getNotificationsByUser(userId);
    }

    @Patch(":id/read")
    markAsRead(@Param("id") id: string) {
        return this.notificationService.markAsRead(id);
    }

    @Delete(":id")
    deleteNotification(@Param("id") id: string) {
        return this.notificationService.deleteNotification(id);
    }
}