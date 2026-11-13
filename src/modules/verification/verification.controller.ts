import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth } from "@nestjs/swagger";
import { diskStorage } from "multer";
import { extname } from "path";
import { VerificationService } from "./verification.service";
import { ReviewVerificationDto } from "./dto/verification.dto";
import { JwtGuard } from "@/src/common/guard/jwt.guard";
import { RolesGuard } from "@/common/guard/roles.guard";
import { Roles } from "@/common/decorators/roles.decorator";
import { CurrentUser } from "@/common/decorators/current-user.decorator";
import { Role } from "@/common/enums/role.enum";

@Controller("verifications")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  // POST /verifications  (user sends an ID or licence photo)
  @Post()
  @Roles(Role.DRIVER, Role.PASSENGER)
  @UseInterceptors(
    FileInterceptor("document", {
      // save the photo in the uploads/verifications folder
      storage: diskStorage({
        destination: "./uploads/verifications",
        filename: (req, file, cb) => {
          cb(null, Date.now() + extname(file.originalname));
        },
      }),
      // only jpg and png images are allowed
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png)$/)) {
          cb(new BadRequestException("Only jpg or png images are allowed"), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    }),
  )
  async submit(
    @CurrentUser() user: { id: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Document file is required");
    }
    return await this.verificationService.submit(
      user.id,
      `/uploads/verifications/${file.filename}`,
    );
  }

  // GET /verifications/me  (user sees his own requests)
  @Get("me")
  @Roles(Role.DRIVER, Role.PASSENGER)
  async getMyRequests(@CurrentUser() user: { id: string }) {
    return await this.verificationService.getMyRequests(user.id);
  }

  // GET /verifications?status=PENDING&page=1&limit=10  (admin only)
  @Get()
  @Roles(Role.ADMIN)
  async getRequests(
    @Query("status") status?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    const p = Math.max(parseInt(page ?? "1") || 1, 1);
    const l = Math.min(Math.max(parseInt(limit ?? "10") || 10, 1), 50);
    return await this.verificationService.getRequests(status, p, l);
  }

  // PATCH /verifications/:id/review  (admin only)
  @Patch(":id/review")
  @Roles(Role.ADMIN)
  async review(
    @Param("id") id: string,
    @Body(ValidationPipe) dto: ReviewVerificationDto,
  ) {
    return await this.verificationService.review(id, dto);
  }
}