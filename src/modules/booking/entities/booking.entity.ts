import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../user/entities/user.entity';
import { BookingStatus } from '../enums/booking-status.enum';

@Entity({ name: 'bookings' })
export class Booking {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Passenger who requested the booking
  @ManyToOne(() => User)
  @JoinColumn({ name: 'passenger_id' })
  passenger!: User;

  // Trip ID 
  @Column({ name: 'trip_id', type: 'uuid' })
  tripId!: string;

  // Number of seats requested
  @Column({ name: 'seats_requested', type: 'int' })
  seatsRequested!: number;

  // Booking status
  @Column({
    type: 'varchar',
    length: 20,
    default: BookingStatus.PENDING,
  })
  status!: BookingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}