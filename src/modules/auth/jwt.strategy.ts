import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { appConfig } from "@/src/config";
import { PassportStrategy } from "@nestjs/passport/dist/passport/passport.strategy";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfig.env.JWT_BEARER_SECRET,
        })
    }

    async validate(payload:any){
        // this object becomes req.user in guards and controllers
        return {
            id: payload.user_id,
            name: payload.name,
            email: payload.email,
            roles: payload.roles,
        };
    }
}