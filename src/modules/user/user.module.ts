import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController, ProfileController],
  providers: [UserService, ProfileService],
  exports: [UserService],
})
export class UserModule {}