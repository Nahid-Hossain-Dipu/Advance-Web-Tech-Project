import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { Role } from "@/common/enums/role.enum";

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  // only university emails are allowed
  @IsEmail()
  @Matches(/@(student\.)?aiub\.edu$/, {
    message: "Use your university email (example: 23-12345-1@student.aiub.edu)",
  })
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  // a user can register only as driver or passenger (not admin)
  @IsOptional()
  @IsIn([Role.DRIVER, Role.PASSENGER])
  role?: Role;
}