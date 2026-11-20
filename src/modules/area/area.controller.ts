import {  Body,Controller, Delete,Get,Param, ParseUUIDPipe, Patch, Post, Query, UseGuards, ValidationPipe,} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { FindManyOptions } from "typeorm";
import { JwtGuard } from "@/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { QueryParserPipe } from "@/common/pipes";
import { AreaService } from "./area.service";
import { CreateAreaDto, UpdateAreaDto } from "./dto/area.dto";
import { Area } from "./entities/area.entity";


const bodyPipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });

@Controller("areas")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard) 
export class AreaController {
    constructor(private readonly areaService: AreaService) {}

    
    @Get()
    async getAreas(@Query(new QueryParserPipe("MANY", ["name"])) options: FindManyOptions<Area>) {
        return await this.areaService.getAreas(options);
    }

    @Get(":id")
    async getArea(@Param("id", ParseUUIDPipe) id: string) {
        return await this.areaService.getArea(id);
    }

    @Post()
    @Roles(Role.ADMIN)
    async createArea(@Body(bodyPipe) dto: CreateAreaDto) {
        return await this.areaService.createArea(dto);
    }

    @Patch(":id")
    @Roles(Role.ADMIN)
    async updateArea(
        @Param("id", ParseUUIDPipe) id: string,
        @Body(bodyPipe) dto: UpdateAreaDto,
    ) {
        return await this.areaService.updateArea(id, dto);
    }

    @Delete(":id")
    @Roles(Role.ADMIN)
    async deleteArea(@Param("id", ParseUUIDPipe) id: string) {
        return await this.areaService.deleteArea(id);
    }
}