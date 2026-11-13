import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Booking } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './enums/booking-status.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,

    private readonly dataSource: DataSource,
  ) {}

  // Create booking request
  async createBooking(passengerId: string, dto: CreateBookingDto) {
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

  // Driver accepts or rejects booking
  async updateBookingStatus(
    bookingId: string,
    driverId: string,
    action: 'accept' | 'reject',
  ) {
    return this.dataSource.transaction(async (manager) => {

      // Find and lock booking
      const bookings = await manager.query(
        `SELECT id, trip_id, seats_requested, status
         FROM bookings
         WHERE id = $1
         FOR UPDATE`,
        [bookingId],
      );

      if (bookings.length === 0) {
        throw new NotFoundException('Booking not found');
      }

      const booking = bookings[0];

      if (booking.status !== BookingStatus.PENDING) {
        throw new ConflictException(
          'This booking has already been processed',
        );
      }

      // Find and lock trip
      const trips = await manager.query(
        `SELECT id, driver_id, available_seats
         FROM dummy_trips
         WHERE id = $1
         FOR UPDATE`,
        [booking.trip_id],
      );

      if (trips.length === 0) {
        throw new NotFoundException('Trip not found');
      }

      const trip = trips[0];

      // Check trip ownership
      if (trip.driver_id !== driverId) {
        throw new ForbiddenException(
          'You are not allowed to manage this booking',
        );
      }

      // Reject booking
      if (action === 'reject') {
        await manager.query(
          `UPDATE bookings
           SET status = $1
           WHERE id = $2`,
          [BookingStatus.REJECTED, bookingId],
        );

        return {
          message: 'Booking rejected successfully',
          status: BookingStatus.REJECTED,
        };
      }

      // Check available seats
      if (trip.available_seats < booking.seats_requested) {
        throw new ConflictException(
          'Not enough available seats',
        );
      }

      // Decrease available seats
      const remainingSeats =
        trip.available_seats - booking.seats_requested;

      await manager.query(
        `UPDATE dummy_trips
         SET available_seats = $1
         WHERE id = $2`,
        [remainingSeats, booking.trip_id],
      );

      // Accept booking
      await manager.query(
        `UPDATE bookings
         SET status = $1
         WHERE id = $2`,
        [BookingStatus.ACCEPTED, bookingId],
      );

      // If no seats remain, mark other pending bookings as trip_full
      if (remainingSeats === 0) {
        await manager.query(
          `UPDATE bookings
           SET status = $1
           WHERE trip_id = $2
           AND status = $3
           AND id != $4`,
          [
            BookingStatus.TRIP_FULL,
            booking.trip_id,
            BookingStatus.PENDING,
            bookingId,
          ],
        );
      }

      return {
        message: 'Booking accepted successfully',
        status: BookingStatus.ACCEPTED,
        remainingSeats,
      };
    });
  }
}