import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Booking } from './entities/booking.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TripModule } from '../trip/trip.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    TripModule,
  ],

  controllers: [BookingController],

  providers: [BookingService],

  exports: [BookingService],
})
export class BookingModule {}