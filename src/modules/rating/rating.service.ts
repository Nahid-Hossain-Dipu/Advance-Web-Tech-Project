import {
  Injectable,NotFoundException,ForbiddenException,} from "@nestjs/common";
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

    const savedRating = await this.ratingRepository.save(rating);

    return savedRating;
    }

    async getAllRatings() {

        const ratings = await this.ratingRepository.find();

        return ratings;
    }


    async getRatingsByUser(userId: string) {

    const ratings = await this.ratingRepository.find({
        where: {ratee_id: userId,},
    });

    return ratings;
}

async getRatingsByTrip(tripId: string) {

    const ratings = await this.ratingRepository.find({
        where: {
            trip_id: tripId,
        },
    });

    return ratings;
}


async updateRating(
    ratingId: string,
    userId: string,
    dto: UpdateRatingDto,
) {
   
    const rating = await this.ratingRepository.findOne({
        where: { id: ratingId },
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
}