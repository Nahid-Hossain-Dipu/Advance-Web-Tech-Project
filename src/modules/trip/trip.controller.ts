import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards,
    ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { Role } from "@/common/enums/role.enum";
import { TripService } from "./trip.service";
import { CreateTripDto, UpdateTripDto } from "./dto/trip.dto";

const bodyPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

@Controller("trips")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
export class TripController {
    constructor(private readonly tripService: TripService) {}

    @Post()
    @Roles(Role.DRIVER)
    async createTrip(
        @CurrentUser() user: AuthUser,
        @Body(bodyPipe) dto: CreateTripDto,
    ) {
        return await this.tripService.createTrip(user.id, dto);
    }

    @Get(":id")
    async getTrip(@Param("id", ParseUUIDPipe) id: string) {
        return await this.tripService.getTrip(id);
    }

    @Patch(":id")
    @Roles(Role.DRIVER)
    async updateTrip(
        @CurrentUser() user: AuthUser,
        @Param("id", ParseUUIDPipe) id: string,
        @Body(bodyPipe) dto: UpdateTripDto,
    ) {
        return await this.tripService.updateTrip(id, user.id, dto);
    }

    @Patch(":id/cancel")
    @Roles(Role.DRIVER)
    async cancelTrip(
        @CurrentUser() user: AuthUser,
        @Param("id", ParseUUIDPipe) id: string,
    ) {
        return await this.tripService.cancelTrip(id, user.id);
    }
}