
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

import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
} from "@nestjs/swagger";

import { AuthGuard } from "@nestjs/passport";

import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";

@ApiTags("Rating")
@Controller("ratings")
export class RatingController {
    constructor(
        private readonly ratingService: RatingService,
    ) {}

    // Create Rating
    @Post()
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Create a new rating",
        description: "Allows an authenticated user to submit a rating.",
    })
    @ApiBody({ type: CreateRatingDto })
    @ApiResponse({
        status: 201,
        description: "Rating created successfully.",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized. JWT token is required.",
    })
    async createRating(
        @Req() req: { user: { id: string } },
        @Body() dto: CreateRatingDto,
    ) {
        const raterId = req.user.id;

        return await this.ratingService.createRating(raterId, dto);
    }

    // Get All Ratings
    @Get()
    @ApiOperation({
        summary: "Get all ratings",
        description: "Retrieve all ratings with pagination.",
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        example: 1,
        description: "Page number.",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        example: 10,
        description: "Number of ratings per page.",
    })
    @ApiResponse({
        status: 200,
        description: "Ratings retrieved successfully.",
    })
    async getAllRatings(
        @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return await this.ratingService.getAllRatings(page, limit);
    }

    // Get Ratings By User
    @Get("user/:userId")
    @ApiOperation({
        summary: "Get ratings by user",
        description: "Retrieve all ratings received by a specific user.",
    })
    @ApiParam({
        name: "userId",
        type: String,
        description: "UUID of the user.",
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        example: 1,
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: "User ratings retrieved successfully.",
    })
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

    // Get Ratings By Trip
    @Get("trip/:tripId")
    @ApiOperation({
        summary: "Get ratings by trip",
        description: "Retrieve all ratings associated with a specific trip.",
    })
    @ApiParam({
        name: "tripId",
        type: String,
        description: "UUID of the trip.",
    })
    @ApiQuery({
        name: "page",
        required: false,
        type: Number,
        example: 1,
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: "Trip ratings retrieved successfully.",
    })
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

    // Update Rating
    @Patch(":id")
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Update a rating",
        description: "Allows the rating owner to update their rating.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "UUID of the rating.",
    })
    @ApiBody({ type: UpdateRatingDto })
    @ApiResponse({
        status: 200,
        description: "Rating updated successfully.",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized. JWT token is required.",
    })
    @ApiResponse({
        status: 403,
        description: "You are not allowed to update this rating.",
    })
    @ApiResponse({
        status: 404,
        description: "Rating not found.",
    })
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

    // Delete Rating
    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Delete a rating",
        description: "Allows the rating owner to delete their rating.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "UUID of the rating.",
    })
    @ApiResponse({
        status: 200,
        description: "Rating deleted successfully.",
    })
    @ApiResponse({
        status: 401,
        description: "Unauthorized. JWT token is required.",
    })
    @ApiResponse({
        status: 403,
        description: "You are not allowed to delete this rating.",
    })
    @ApiResponse({
        status: 404,
        description: "Rating not found.",
    })
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
