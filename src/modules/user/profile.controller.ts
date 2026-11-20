import { Body, Controller, Get, Patch, UseGuards, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dto/profile.dto";
import { JwtGuard } from "@/src/common/guard/jwt.guard";
import { CurrentUser } from "@/common/decorators/current-user.decorator";

@Controller("profile")
@ApiBearerAuth()
@UseGuards(JwtGuard) // any logged in user can use these routes
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // GET /profile
  @Get()
  async getProfile(@CurrentUser() user: { id: string }) {
    return await this.profileService.getProfile(user.id);
  }

  // PATCH /profile
  @Patch()
  async updateProfile(
    @CurrentUser() user: { id: string },
    @Body(ValidationPipe) dto: UpdateProfileDto,
  ) {
    return await this.profileService.updateProfile(user.id, dto);
  }
}