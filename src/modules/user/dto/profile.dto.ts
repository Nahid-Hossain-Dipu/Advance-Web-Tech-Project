import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

// Data a user can change in his own profile (all fields are optional)
export class UpdateProfileDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}