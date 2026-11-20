import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { UpdateProfileDto } from "./dto/profile.dto";
import { hashPassword } from "@/common/helpers/password.helper";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Get my own profile
  async getProfile(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      // do not send the password to the client
      const { password, ...rest } = user;
      return rest;
    } catch (error) {
      throw error;
    }
  }

  // Update my own profile
  async updateProfile(id: string, dto: UpdateProfileDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      if (dto.password) {
        dto.password = await hashPassword(dto.password);
      }
      Object.assign(user, dto);
      user.updated_at = new Date();
      const saved = await this.userRepository.save(user);
      const { password, ...rest } = saved;
      return rest;
    } catch (error) {
      throw error;
    }
  }
}