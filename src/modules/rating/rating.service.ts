import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateRatingDto } from "./dto/create-rating.dto";
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
}