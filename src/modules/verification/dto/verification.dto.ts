import { IsIn, IsOptional, IsString } from "class-validator";
import { VerificationStatus } from "../entities/verification.entity";

// Data the admin sends to approve or reject a request
export class ReviewVerificationDto {
  @IsIn([VerificationStatus.APPROVED, VerificationStatus.REJECTED])
  status!: VerificationStatus;

  @IsOptional()
  @IsString()
  note?: string;
}