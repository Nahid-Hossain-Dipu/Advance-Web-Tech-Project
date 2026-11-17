import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Notification } from "./entities/notification.entity.js";
import { CreateNotificationDto } from "./dto/create-notification.dto.js";

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) {}

    async createNotification(dto: CreateNotificationDto) {
        const notification = this.notificationRepository.create({
            user_id: dto.user_id,
            title: dto.title,
            message: dto.message,
        });

        return await this.notificationRepository.save(notification);
    }

    async getAllNotifications(page = 1, limit = 10) {
        page = Math.max(1, page);
        limit = Math.min(100, Math.max(1, limit));

        const [data, total] = await this.notificationRepository.findAndCount({
            order: {
                created_at: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getNotificationsByUser(
        userId: string,
        page = 1,
        limit = 10,
    ) {
        page = Math.max(1, page);
        limit = Math.min(100, Math.max(1, limit));

        const [data, total] = await this.notificationRepository.findAndCount({
            where: {
                user_id: userId,
            },
            order: {
                created_at: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async markAsRead(notificationId: string) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id: notificationId,
            },
        });

        if (!notification) {
            throw new NotFoundException("Notification not found");
        }

        notification.is_read = true;

        return await this.notificationRepository.save(notification);
    }

    async deleteNotification(notificationId: string) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id: notificationId,
            },
        });

        if (!notification) {
            throw new NotFoundException("Notification not found");
        }

        await this.notificationRepository.remove(notification);

        return {
            message: "Notification deleted successfully",
        };
    }
}