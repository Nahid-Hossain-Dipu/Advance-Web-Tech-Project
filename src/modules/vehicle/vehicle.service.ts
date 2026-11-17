import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Vehicle } from "./entities/vehicle.entity";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto/vehicle.dto";

@Injectable()
export class VehicleService {
    constructor(
        @InjectRepository(Vehicle)
        private readonly vehicleRepository: Repository<Vehicle>,
    ) {}

    async getMyVehicles(driverId: string, limit: number, offset: number) {
        try {
            const take = limit > 0 ? Math.min(limit, 100) : 10;
            const skip = offset > 0 ? offset : 0;

            const [data, total] = await this.vehicleRepository.findAndCount({
                where: { driver_id: driverId },
                take,
                skip,
                order: { created_at: "DESC" },
            });

            return { data, total, limit: take, offset: skip };
        } catch (error) {
            throw error;
        }
    }

    async getVehicle(id: string, driverId: string) {
        try {
            const vehicle = await this.vehicleRepository.findOne({
                where: { id, driver_id: driverId },
            });
            if (!vehicle) {
                throw new NotFoundException("Vehicle not found");
            }
            return vehicle;
        } catch (error) {
            throw error;
        }
    }

    async createVehicle(driverId: string, dto: CreateVehicleDto) {
        try {
            const plate_no = dto.plate_no.trim();
            const oldVehicle = await this.vehicleRepository.findOne({ where: { plate_no } });
            if (oldVehicle) {
                throw new ConflictException("Plate number already exists");
            }
            const vehicle = this.vehicleRepository.create({
                ...dto,
                model: dto.model.trim(),
                plate_no,
                driver_id: driverId,
            });
            return await this.vehicleRepository.save(vehicle);
        } catch (error) {
            throw error;
        }
    }

    async updateVehicle(id: string, driverId: string, dto: UpdateVehicleDto) {
        try {
            const vehicle = await this.getVehicle(id, driverId);

            if (dto.plate_no) {
                const plate_no = dto.plate_no.trim();
                const oldVehicle = await this.vehicleRepository.findOne({ where: { plate_no } });
                if (oldVehicle && oldVehicle.id !== id) {
                    throw new ConflictException("Plate number already exists");
                }
                dto.plate_no = plate_no;
            }
            if (dto.model) {
                dto.model = dto.model.trim();
            }

            Object.assign(vehicle, dto);
            vehicle.updated_at = new Date();
            return await this.vehicleRepository.save(vehicle);
        } catch (error) {
            throw error;
        }
    }

    async deleteVehicle(id: string, driverId: string) {
        try {
            const vehicle = await this.getVehicle(id, driverId);
            await this.vehicleRepository.remove(vehicle);
            return { message: "Vehicle deleted" };
        } catch (error) {
            throw error;
        }
    }
}