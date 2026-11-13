import {Controller,Get,Post,Body,Param} from "@nestjs/common";
import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
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