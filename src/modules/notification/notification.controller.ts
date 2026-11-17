import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
    DefaultValuePipe,
    ParseIntPipe,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from "@nestjs/swagger";

import { NotificationService } from "./notification.service.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";

import { RolesGuard } from "../../common/guard/roles.guard.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { Role } from "../../common/enums/role.enum.js";

interface AuthenticatedRequest {
    user: {
        id: string;
        roles: string[];
    };
}

@ApiTags("Notification")
@ApiBearerAuth()
@Controller("notifications")
@UseGuards(AuthGuard("jwt"))
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) {}

    // Create Notification (Admin Only)
    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: "Create a notification",
        description: "Only admins can create notifications.",
    })
    @ApiBody({ type: CreateNotificationDto })
    @ApiResponse({
        status: 201,
        description: "Notification created successfully.",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden. Admin access required.",
    })
    createNotification(@Body() dto: CreateNotificationDto) {
        return this.notificationService.createNotification(dto);
    }

    // Get All Notifications (Admin Only)
    @Get()
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: "Get all notifications",
        description: "Admins can view all notifications with pagination.",
    })
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: "All notifications retrieved successfully.",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden. Admin access required.",
    })
    getAllNotifications(
        @Req() req: AuthenticatedRequest,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.notificationService.getAllNotifications(
            req.user.id,
            true,
            page,
            limit,
        );
    }

    // Get My Notifications
    @Get("my")
    @ApiOperation({
        summary: "Get my notifications",
        description: "Users can view their own notifications.",
    })
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: "User notifications retrieved successfully.",
    })
    getMyNotifications(
        @Req() req: AuthenticatedRequest,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.notificationService.getNotificationsByUser(
            req.user.id,
            req.user.id,
            false,
            page,
            limit,
        );
    }

    // Get Notifications By User ID
    @Get("user/:userId")
    @ApiOperation({
        summary: "Get notifications by user ID",
        description:
            "Users can view their own notifications. Admins can view any user's notifications.",
    })
    @ApiParam({
        name: "userId",
        description: "User UUID",
        type: String,
    })
    @ApiQuery({ name: "page", required: false, type: Number })
    @ApiQuery({ name: "limit", required: false, type: Number })
    @ApiResponse({
        status: 200,
        description: "User notifications retrieved successfully.",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden. You cannot access this user's notifications.",
    })
    getNotificationsByUser(
        @Param("userId") userId: string,
        @Req() req: AuthenticatedRequest,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        const isAdmin = req.user.roles.includes(Role.ADMIN);

        return this.notificationService.getNotificationsByUser(
            userId,
            req.user.id,
            isAdmin,
            page,
            limit,
        );
    }

    // Mark Notification As Read
    @Patch(":id/read")
    @ApiOperation({
        summary: "Mark notification as read",
        description: "Users can mark their own notifications as read. Admins can mark any notification as read.",
    })
    @ApiParam({
        name: "id",
        description: "Notification UUID",
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: "Notification marked as read successfully.",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden. You cannot update this notification.",
    })
    @ApiResponse({
        status: 404,
        description: "Notification not found.",
    })
    markAsRead(
        @Param("id") id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const isAdmin = req.user.roles.includes(Role.ADMIN);

        return this.notificationService.markAsRead(
            id,
            req.user.id,
            isAdmin,
        );
    }

    // Delete Notification
    @Delete(":id")
    @ApiOperation({
        summary: "Delete notification",
        description: "Users can delete their own notifications. Admins can delete any notification.",
    })
    @ApiParam({
        name: "id",
        description: "Notification UUID",
        type: String,
    })
    @ApiResponse({
        status: 200,
        description: "Notification deleted successfully.",
    })
    @ApiResponse({
        status: 403,
        description: "Forbidden. You cannot delete this notification.",
    })
    @ApiResponse({
        status: 404,
        description: "Notification not found.",
    })
    deleteNotification(
        @Param("id") id: string,
        @Req() req: AuthenticatedRequest,
    ) {
        const isAdmin = req.user.roles.includes(Role.ADMIN);

        return this.notificationService.deleteNotification(
            id,
            req.user.id,
            isAdmin,
        );
    }
}