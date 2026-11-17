import { Body, Controller, DefaultValuePipe, Delete,  Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query,UseGuards, ValidationPipe,} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { AuthUser } from "@/common/interfaces/auth-user.interface";
import { Role } from "@/common/enums/role.enum";
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto/vehicle.dto";

const bodyPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

@Controller("vehicles")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.DRIVER)
export class VehicleController {
    constructor(private readonly vehicleService: VehicleService) {}

    @Get()
    async getMyVehicles(
        @CurrentUser() user: AuthUser,
        @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number,
    ) {
        return await this.vehicleService.getMyVehicles(user.id, limit, offset);
    }

    @Get(":id")
    async getVehicle(
        @CurrentUser() user: AuthUser,
        @Param("id", ParseUUIDPipe) id: string,
    ) {
        return await this.vehicleService.getVehicle(id, user.id);
    }

    @Post()
    async createVehicle(
        @CurrentUser() user: AuthUser,
        @Body(bodyPipe) dto: CreateVehicleDto,
    ) {
        return await this.vehicleService.createVehicle(user.id, dto);
    }

    @Patch(":id")
    async updateVehicle(
        @CurrentUser() user: AuthUser,
        @Param("id", ParseUUIDPipe) id: string,
        @Body(bodyPipe) dto: UpdateVehicleDto,
    ) {
        return await this.vehicleService.updateVehicle(id, user.id, dto);
    }

    @Delete(":id")
    async deleteVehicle(
        @CurrentUser() user: AuthUser,
        @Param("id", ParseUUIDPipe) id: string,
    ) {
        return await this.vehicleService.deleteVehicle(id, user.id);
    }
}