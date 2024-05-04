import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { JwtEmailPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: "topSecret51",
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtEmailPayload): Promise<User> {
        const { email } = payload;
        const user: User = await this.userRepository.findOneBy({ email });
        if (!user) throw new UnauthorizedException();
        return user;
    }
}