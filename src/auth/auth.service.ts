import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    async singhUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.userRepository.userSignUp(authCredentialsDto);
    }
}
