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
import { TripStatus } from '../trip/entities/trip.entity';

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

    // Check actual trip
    const trips = await this.dataSource.query(
      `SELECT id, status, departure_time, seats_total
       FROM trips
       WHERE id = $1`,
      [dto.tripId],
    );

    if (trips.length === 0) {
      throw new NotFoundException('Trip not found');
    }

    const trip = trips[0];

    if (trip.status !== TripStatus.SCHEDULED) {
      throw new ConflictException(
        'Booking is only available for scheduled trips',
      );
    }

    if (new Date(trip.departure_time).getTime() <= Date.now()) {
      throw new ConflictException(
        'Cannot book a trip that has already departed',
      );
    }

    if (dto.seatsRequested > trip.seats_total) {
      throw new ConflictException(
        'Requested seats exceed total trip capacity',
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

  // Get all bookings for a specific trip
  async getBookingsByTrip(tripId: string, driverId: string) {
    const trips = await this.dataSource.query(
      `SELECT id, driver_id
       FROM trips
       WHERE id = $1`,
      [tripId],
    );

    if (trips.length === 0) {
      throw new NotFoundException('Trip not found');
    }

    if (trips[0].driver_id !== driverId) {
      throw new ForbiddenException(
        'You are not allowed to view bookings for this trip',
      );
    }

    const bookings = await this.bookingRepository.find({
      where: {
        tripId: tripId,
      },
      relations: {
        passenger: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      message: 'Trip bookings retrieved successfully',
      tripId,
      total: bookings.length,
      data: bookings,
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

      // Find and lock actual trip
      const trips = await manager.query(
        `SELECT id, driver_id, seats_available,
                seats_total, status, departure_time
         FROM trips
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

      // Check trip status
      if (trip.status !== TripStatus.SCHEDULED) {
        throw new ConflictException(
          'Only scheduled trips can accept bookings',
        );
      }

      // Check departure time
      if (new Date(trip.departure_time).getTime() <= Date.now()) {
        throw new ConflictException(
          'Cannot accept booking for a trip that has already departed',
        );
      }

      // Check available seats
      if (trip.seats_available < booking.seats_requested) {
        throw new ConflictException(
          'Not enough available seats',
        );
      }

      // Decrease available seats
      const remainingSeats =
        trip.seats_available - booking.seats_requested;

      await manager.query(
        `UPDATE trips
         SET seats_available = $1
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

  // Passenger cancels their own booking
  async cancelBooking(passengerId: string, bookingId: string) {
    return this.dataSource.transaction(async (manager) => {

      // Find and lock booking
      const bookings = await manager.query(
        `SELECT id, passenger_id, trip_id, seats_requested, status
         FROM bookings
         WHERE id = $1
         FOR UPDATE`,
        [bookingId],
      );

      if (bookings.length === 0) {
        throw new NotFoundException('Booking not found');
      }

      const booking = bookings[0];

      // Check booking ownership
      if (booking.passenger_id !== passengerId) {
        throw new ForbiddenException(
          'You are not allowed to cancel this booking',
        );
      }

      // Only pending or accepted bookings can be cancelled
      if (
        booking.status !== BookingStatus.PENDING &&
        booking.status !== BookingStatus.ACCEPTED
      ) {
        throw new ConflictException(
          'This booking cannot be cancelled',
        );
      }

      // If booking was accepted, restore the seats
      if (booking.status === BookingStatus.ACCEPTED) {

        // Lock actual trip row
        const trips = await manager.query(
          `SELECT id, seats_available, seats_total
           FROM trips
           WHERE id = $1
           FOR UPDATE`,
          [booking.trip_id],
        );

        if (trips.length === 0) {
          throw new NotFoundException('Trip not found');
        }

        const trip = trips[0];

        const updatedSeats =
          trip.seats_available + booking.seats_requested;

        // Restore seats
        await manager.query(
          `UPDATE trips
           SET seats_available = $1
           WHERE id = $2`,
          [updatedSeats, booking.trip_id],
        );

        // Update booking status
        await manager.query(
          `UPDATE bookings
           SET status = $1
           WHERE id = $2`,
          [BookingStatus.CANCELLED, bookingId],
        );

        return {
          message: 'Booking cancelled successfully',
          status: BookingStatus.CANCELLED,
          restoredSeats: booking.seats_requested,
          availableSeats: updatedSeats,
        };
      }

      // Pending booking: no seats need to be restored
      await manager.query(
        `UPDATE bookings
         SET status = $1
         WHERE id = $2`,
        [BookingStatus.CANCELLED, bookingId],
      );

      return {
        message: 'Booking cancelled successfully',
        status: BookingStatus.CANCELLED,
      };
    });
  }
}