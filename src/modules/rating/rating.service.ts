import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
import { Rating } from "./entities/rating.entity";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating)
        private readonly ratingRepository: Repository<Rating>,
    ) {}

    async createRating(raterId: string, dto: CreateRatingDto) {
        const rating = this.ratingRepository.create({
            ...dto,
            rater_id: raterId,
        });

        return await this.ratingRepository.save(rating);
    }

    async getAllRatings(page: number = 1, limit: number = 10) {
        page = Math.max(1, page);
        limit = Math.max(1, Math.min(100, limit));

        const [ratings, total] = await this.ratingRepository.findAndCount({
            order: {
                created_at: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: ratings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getRatingsByUser(
        userId: string,
        page: number = 1,
        limit: number = 10,
    ) {
        page = Math.max(1, page);
        limit = Math.max(1, Math.min(100, limit));

        const [ratings, total] = await this.ratingRepository.findAndCount({
            where: {
                ratee_id: userId,
            },
            order: {
                created_at: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: ratings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async getRatingsByTrip(
        tripId: string,
        page: number = 1,
        limit: number = 10,
    ) {
        page = Math.max(1, page);
        limit = Math.max(1, Math.min(100, limit));

        const [ratings, total] = await this.ratingRepository.findAndCount({
            where: {
                trip_id: tripId,
            },
            order: {
                created_at: "DESC",
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: ratings,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async updateRating(
        ratingId: string,
        userId: string,
        dto: UpdateRatingDto,
    ) {
        const rating = await this.ratingRepository.findOne({
            where: {
                id: ratingId,
            },
        });

        if (!rating) {
            throw new NotFoundException("Rating not found");
        }

        if (rating.rater_id !== userId) {
            throw new ForbiddenException(
                "You can only update your own rating",
            );
        }

        if (dto.score !== undefined) {
            rating.score = dto.score;
        }

        if (dto.comment !== undefined) {
            rating.comment = dto.comment;
        }

        return await this.ratingRepository.save(rating);
    }

    async deleteRating(ratingId: string, userId: string) {
        const rating = await this.ratingRepository.findOne({
            where: {
                id: ratingId,
            },
        });

        if (!rating) {
            throw new NotFoundException("Rating not found");
        }

        if (rating.rater_id !== userId) {
            throw new ForbiddenException(
                "You can only delete your own rating",
            );
        }

        await this.ratingRepository.remove(rating);

        return {
            message: "Rating deleted successfully",
        };
    }
}