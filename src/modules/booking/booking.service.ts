import {Injectable,ConflictException,} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingService {

  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,) {}

  // Create booking request
  async createBooking(passengerId: string,dto: CreateBookingDto,) {

    // Check existing pending or accepted booking
    const existingBooking = await this.bookingRepository.findOne({
      where: [
        {
          passenger: { id: passengerId },
          tripId: dto.tripId,
          status: BookingStatus.PENDING,
        },
        {
          passenger: { id: passengerId },
          tripId: dto.tripId,
          status: BookingStatus.ACCEPTED,
        },
      ],
    });

    if (existingBooking) {
      throw new ConflictException(
        'You already have an active booking for this trip',
      );
    }

    const booking = this.bookingRepository.create({
      passenger: { id: passengerId } as any,
      tripId: dto.tripId,
      seatsRequested: dto.seatsRequested,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    return {
      message: 'Booking request created successfully',
      data: {
        id: savedBooking.id,
        tripId: savedBooking.tripId,
        seatsRequested: savedBooking.seatsRequested,
        status: savedBooking.status,
      },
    };
  }

}