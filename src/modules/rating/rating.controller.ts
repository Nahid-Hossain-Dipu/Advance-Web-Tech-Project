import {Controller,Get,Post,Patch,Delete,Body,Param} from "@nestjs/common";
import { RatingService } from "./rating.service";
import { CreateRatingDto } from "./dto/create-rating.dto";
import { UpdateRatingDto } from "./dto/update-rating.dto";
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


@Delete(':id')
@UseGuards(AuthGuard('jwt'))
async deleteRating(
    @Param('id') ratingId: string,
    @Req() req: { user: { id: string } },
) {
    const userId = req.user.id;

    return await this.ratingService.deleteRating(
        ratingId,
        userId,
    );
}


}