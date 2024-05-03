import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialsDto } from "./dto/create-user.dto";
import { User } from "./user.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {}

    async singhUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return await this.userRepository.userSignUp(authCredentialsDto);
    }
}
