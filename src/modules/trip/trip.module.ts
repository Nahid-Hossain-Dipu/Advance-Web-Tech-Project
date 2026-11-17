import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TripController } from "./trip.controller";
import { TripService } from "./trip.service";
import { Trip } from "./entities/trip.entity";
import { User } from "@/modules/user/entities/user.entity";
import { VehicleModule } from "@/modules/vehicle/vehicle.module";
import { AreaModule } from "@/modules/area/area.module";

@Module({
  imports: [TypeOrmModule.forFeature([Trip, User]), VehicleModule, AreaModule],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripModule {}