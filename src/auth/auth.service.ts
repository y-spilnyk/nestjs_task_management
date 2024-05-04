import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./dto/create-user.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.userRepository.userSignUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<JwtPayload> {
        const login = await this.userRepository.userSignIn(authCredentialsDto);

        if (login) {
            const { email } = authCredentialsDto;
            const accessToken: string = await this.jwtService.signAsync({ email });
            return { accessToken };
        }
    }
}
