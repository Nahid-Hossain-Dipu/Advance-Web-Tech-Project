import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import{UserService} from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto";
import { JwtGuard } from "@/src/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard) // first login is checked, then the role
@Roles(Role.ADMIN) // only an admin can use these routes
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    async getUsers() {
        return await this.userService.getUsers();
    }

    @Post()
        async createUser(@Body() dto: CreateUserDto) {
            return await this.userService.createUser(dto);
    }
    
    @Patch(":id")
        async updateUser(@Param("id") id: string , @Body() dto: UpdateUserDto) {
            return await this.userService.updateUser(id, dto);
    }

    @Delete(":id")
        async deleteUser(@Param("id") id: string) {
            return await this.userService.deleteUser(id);
    }

}