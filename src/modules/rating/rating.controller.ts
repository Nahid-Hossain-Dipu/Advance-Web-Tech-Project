import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    Query,
    DefaultValuePipe,
    ParseIntPipe,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";

@Controller("ratings")
export class RatingController {
    constructor(
        private readonly ratingService: RatingService,
    ) {}

    @Post()
    @UseGuards(AuthGuard("jwt"))
    async createRating(
        @Req() req: { user: { id: string } },
        @Body() dto: CreateRatingDto,
    ) {
        const raterId = req.user.id;

        return await this.ratingService.createRating(raterId, dto);
    }

    @Get()
    async getAllRatings(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return await this.ratingService.getAllRatings(page, limit);
    }

    @Get("user/:userId")
    async getRatingsByUser(
        @Param("userId") userId: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return await this.ratingService.getRatingsByUser(
            userId,
            page,
            limit,
        );
    }

    @Get("trip/:tripId")
    async getRatingsByTrip(
        @Param("tripId") tripId: string,
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return await this.ratingService.getRatingsByTrip(
            tripId,
            page,
            limit,
        );
    }

    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    async updateRating(
        @Param("id") ratingId: string,
        @Req() req: { user: { id: string } },
        @Body() dto: UpdateRatingDto,
    ) {
        const userId = req.user.id;

        return await this.ratingService.updateRating(
            ratingId,
            userId,
            dto,
        );
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    async deleteRating(
        @Param("id") ratingId: string,
        @Req() req: { user: { id: string } },
    ) {
        const userId = req.user.id;

        return await this.ratingService.deleteRating(
            ratingId,
            userId,
        );
    }
}