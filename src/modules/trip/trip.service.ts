import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "@/common/enums/role.enum";
import { User } from "@/modules/user/entities/user.entity";
import { VehicleService } from "@/modules/vehicle/vehicle.service";
import { AreaService } from "@/modules/area/area.service";
import { Trip, TripStatus } from "./entities/trip.entity";
import { CreateTripDto } from "./dto/trip.dto";

const COST_PER_KM = 5;
const MAX_COST_CHANGE = 0.2;

@Injectable()
export class TripService {
    constructor(
        @InjectRepository(Trip)
        private readonly tripRepository: Repository<Trip>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly vehicleService: VehicleService,
        private readonly areaService: AreaService,
    ) {}

    async createTrip(driverId: string, dto: CreateTripDto) {
        try {
            const driver = await this.userRepository.findOne({ where: { id: driverId } });
            if (!driver || driver.role !== Role.DRIVER || !driver.is_verified) {
                throw new ForbiddenException("Only an approved driver can post a trip");
            }

            const vehicle = await this.vehicleService.getVehicle(dto.vehicle_id, driverId);
            const pickup = await this.areaService.getArea(dto.pickup_area_id);
            const destination = await this.areaService.getArea(dto.destination_area_id);

            if (!pickup.is_active || !destination.is_active) {
                throw new BadRequestException("Area is not active");
            }
            if (pickup.id === destination.id) {
                throw new BadRequestException("Pickup and destination must be different");
            }

            const departure_time = new Date(dto.departure_time);
            if (departure_time.getTime() <= Date.now()) {
                throw new BadRequestException("Departure time must be in the future");
            }
            if (dto.seats_total > vehicle.seat_capacity) {
                throw new BadRequestException("Seats cannot be more than the vehicle capacity");
            }

            const suggested = this.suggestCost(dto.distance_km);
            let cost_per_seat = suggested;
            if (dto.cost_per_seat !== undefined) {
                const min = Math.max(1, Math.floor(suggested * (1 - MAX_COST_CHANGE)));
                const max = Math.ceil(suggested * (1 + MAX_COST_CHANGE));
                if (dto.cost_per_seat < min || dto.cost_per_seat > max) {
                    throw new BadRequestException(`Cost per seat must be between ${min} and ${max}`);
                }
                cost_per_seat = dto.cost_per_seat;
            }

            const trip = this.tripRepository.create({
                driver_id: driverId,
                vehicle_id: vehicle.id,
                pickup_area_id: pickup.id,
                destination_area_id: destination.id,
                departure_time,
                distance_km: dto.distance_km,
                seats_total: dto.seats_total,
                seats_available: dto.seats_total,
                cost_per_seat,
                status: TripStatus.SCHEDULED,
            });
            return await this.tripRepository.save(trip);
        } catch (error) {
            throw error;
        }
    }

    async getTrip(id: string) {
        try {
            const trip = await this.tripRepository.findOne({
                where: { id },
                relations: { driver: true, vehicle: true, pickup_area: true, destination_area: true },
            });
            if (!trip) {
                throw new NotFoundException("Trip not found");
            }
            return this.toResponse(trip);
        } catch (error) {
            throw error;
        }
    }

    private suggestCost(distance_km: number) {
        return Math.max(1, Math.round(distance_km * COST_PER_KM));
    }

    private toResponse(trip: Trip) {
        const { driver, vehicle, ...rest } = trip;
        return {
            ...rest,
            driver: driver ? { id: driver.id, name: driver.name } : null,
            vehicle: vehicle
                ? { id: vehicle.id, type: vehicle.type, model: vehicle.model, seat_capacity: vehicle.seat_capacity }
                : null,
        };
    }
}