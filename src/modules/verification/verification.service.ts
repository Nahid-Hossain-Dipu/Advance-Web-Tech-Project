import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Verification, VerificationStatus } from "./entities/verification.entity";
import { ReviewVerificationDto } from "./dto/verification.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,
    private readonly userService: UserService,
  ) {}

  // User sends a new verification request
  async submit(userId: string, documentPath: string) {
    try {
      const alreadyVerified = await this.userService.isVerified(userId);
      if (alreadyVerified) {
        throw new ConflictException("Your account is already verified");
      }
      const pending = await this.verificationRepository.findOne({
        where: {
          user_id: userId,
          status: VerificationStatus.PENDING,
        },
      });
      if (pending) {
        throw new ConflictException("You already have a pending request");
      }
      const request = this.verificationRepository.create({
        user_id: userId,
        document_path: documentPath,
      });
      return await this.verificationRepository.save(request);
    } catch (error) {
      throw error;
    }
  }

  // User sees his own requests
  async getMyRequests(userId: string) {
    try {
      return await this.verificationRepository.find({
        where: {
          user_id: userId,
        },
        order: { created_at: "DESC" },
      });
    } catch (error) {
      throw error;
    }
  }

  // Admin sees all requests (with filter and pagination)
  async getRequests(status: string | undefined, page: number, limit: number) {
    try {
      const [data, total] = await this.verificationRepository.findAndCount({
        where: status ? { status: status as VerificationStatus } : {},
        relations: { user: true },
        // select only safe fields, so the password hash is never sent
        select: {
          id: true,
          document_path: true,
          status: true,
          admin_note: true,
          created_at: true,
          user: { id: true, name: true, email: true, role: true },
        },
        order: { created_at: "DESC" },
        skip: (page - 1) * limit,
        take: limit,
      });
      return { data, total, page, limit };
    } catch (error) {
      throw error;
    }
  }

  // Admin approves or rejects a request
  async review(id: string, dto: ReviewVerificationDto) {
    try {
      const request = await this.verificationRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!request) {
        throw new NotFoundException("Verification request not found");
      }
      if (request.status !== VerificationStatus.PENDING) {
        throw new ConflictException("This request is already reviewed");
      }
      request.status = dto.status;
      request.admin_note = dto.note ?? null;
      request.reviewed_at = new Date();
      const saved = await this.verificationRepository.save(request);
      if (dto.status === VerificationStatus.APPROVED) {
        await this.userService.setVerified(request.user_id, true);
      }
      return saved;
    } catch (error) {
      throw error;
    }
  }
}