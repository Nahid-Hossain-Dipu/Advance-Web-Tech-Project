import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Area } from "./entities/area.entity";
import { CreateAreaDto, UpdateAreaDto } from "./dto/area.dto";

@Injectable()
export class AreaService {
    constructor(
        @InjectRepository(Area)
        private readonly areaRepository: Repository<Area>,
    ) {}

    
    async getAreas(options: FindManyOptions<Area> = {}) {
        try {
            const take = options.take && options.take > 0 ? Math.min(options.take, 100) : 10;
            const skip = options.skip && options.skip > 0 ? options.skip : 0;

            const [data, total] = await this.areaRepository.findAndCount({
                ...options,
                take,
                skip,
                order: options.order ?? { name: "ASC" },
            });

            return { data, total, limit: take, offset: skip };
        } catch (error) {
            throw error;
        }
    }

    async getArea(id: string) {
        try {
            const area = await this.areaRepository.findOne({ where: { id } });
            if (!area) {
                throw new NotFoundException("Area not found");
            }
            return area;
        } catch (error) {
            throw error;
        }
    }

    async createArea(dto: CreateAreaDto) {
        try {
            const name = dto.name.trim();
            const oldArea = await this.areaRepository.findOne({ where: { name } });
            if (oldArea) {
                throw new ConflictException("Area name already exists");
            }
            const area = this.areaRepository.create({ ...dto, name });
            return await this.areaRepository.save(area);
        } catch (error) {
            throw error;
        }
    }

    async updateArea(id: string, dto: UpdateAreaDto) {
        try {
            const area = await this.getArea(id);

            if (dto.name) {
                const name = dto.name.trim();
                const oldArea = await this.areaRepository.findOne({ where: { name } });
                if (oldArea && oldArea.id !== id) {
                    throw new ConflictException("Area name already exists");
                }
                dto.name = name;
            }

            Object.assign(area, dto);
            area.updated_at = new Date();
            return await this.areaRepository.save(area);
        } catch (error) {
            throw error;
        }
    }

    async deleteArea(id: string) {
        try {
            const area = await this.getArea(id);
            await this.areaRepository.remove(area);
            return { message: "Area deleted" };
        } catch (error) {
            throw error;
        }
    }
}