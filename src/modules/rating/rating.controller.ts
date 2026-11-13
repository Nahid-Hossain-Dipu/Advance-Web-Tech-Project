import {Controller,Get,Post,Body,Param,} from "@nestjs/common";
import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";

@Controller("ratings")
export class RatingController {

    constructor(
        private readonly ratingService: RatingService,
    ) {}


    @Post()
    async createRating(@Body() dto: CreateRatingDto) {
    const raterId = "temporary-user-id";

    return await this.ratingService.createRating(raterId, dto);
    }

    
    @Get()
    async getAllRatings() {
    return await this.ratingService.getAllRatings();
    }

    @Get("user/:userId")
    async getRatingsByUser(@Param("userId") userId: string) {
    return await this.ratingService.getRatingsByUser(userId);
    }       


    @Get("trip/:tripId")
    async getRatingsByTrip(@Param("tripId") tripId: string) {
    return await this.ratingService.getRatingsByTrip(tripId);
  }


}