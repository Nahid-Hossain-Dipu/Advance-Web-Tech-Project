import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Trip ID',
  })
  @IsUUID()
  tripId!: string;

  @ApiProperty({
    example: 2,
    description: 'Number of seats requested',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  seatsRequested!: number;

}