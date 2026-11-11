import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "@/modules/user/user.service";
import { JwtService } from "@nestjs/jwt";
import { AuthDto } from "./dto/auth.dto";
import { RegisterDto } from "./dto/register.dto";
import { User } from "../user/entities/user.entity";
import { appConfig } from "@/src/config";
import { verifyPassword } from "@/common/helpers/password.helper";



@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
  ) {}


  async register(dto: RegisterDto) {
    return await this.userService.createUser(dto);
  }

  async signIn(dto: AuthDto) {
    const user = await this.checkUserByEmail(dto.email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await this.validateUser(user, dto.password);
    const { access_token, refresh_token, expires_in } = await this.signTokens(user);
    return {
      access_token,
      refresh_token,
      expires_in
    };
  }
    
async signTokens(user: User): Promise<{
  access_token: string,
  refresh_token: string,
  expires_in: number
  permission?: any
}> {
  const expires_in = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days  
  const accessPayload = {
    user_id: user.id,
    name: user?.name,
    email: user.email,
    roles: [user.role], // role goes inside the token
  }
  
  const refreshPayload = {
    user_id: user.id,
  };
  const bearerSecret = appConfig.env.JWT_BEARER_SECRET;
  const refreshSecret = appConfig.env.JWT_REFRESH_SECRET;

  const accessToken = await this.jwt.signAsync(accessPayload, {
    expiresIn: "30d",
    secret: bearerSecret,
  });
  const refreshToken = await this.jwt.signAsync(refreshPayload, {
    expiresIn: "30d",
    secret: refreshSecret,
  });
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: expires_in,
  };
}

async checkUserByEmail(email:string){
  try{
    const user=await this.userService.findOneByEmail(email);
    return user;
  }
  catch(e:any){
    throw new NotFoundException("User not found") ;
  }
}

async validateUser(user:User, password:string){
  // compare the plain password with the saved hash
  const passwordMatch = await verifyPassword(user.password, password);
  if(!passwordMatch){
    throw new UnauthorizedException("Invalid password");
  }
  return true;
}

}