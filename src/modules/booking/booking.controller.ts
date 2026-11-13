import {Controller,Post,Body,UseGuards,} from '@nestjs/common';

import {ApiTags,ApiBearerAuth,ApiOperation,} from '@nestjs/swagger';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';

import { JwtGuard } from '../../common/guard/jwt.guard';
import { RolesGuard } from '../../common/guard/roles.guard';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

import { Role } from '../../common/enums/role.enum';
import { AuthUser } from '../../common/interfaces/auth-user.interface';

@ApiTags('Bookings')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtGuard, RolesGuard)
export class BookingController {

  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(Role.PASSENGER)
  @ApiOperation({
    summary: 'Create a booking request',
  })
  createBooking(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateBookingDto,
  ) {

    return this.bookingService.createBooking(
      user.id,
      dto,
    );
  }

}