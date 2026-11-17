import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    DefaultValuePipe,
    ParseIntPipe,
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
    getAllNotifications(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.notificationService.getAllNotifications(page, limit);
    }

    @Get("user/:userId")
    getNotificationsByUser(
        @Param("userId") userId: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.notificationService.getNotificationsByUser(
            userId,
            page,
            limit,
        );
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