import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/create-user.dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private readonly eManager: EntityManager) {
        super(User, eManager);
    }

    async userSignUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { email, password } = authCredentialsDto;

        const createUser = this.create({
            email,
            password
        });
        await this.save(createUser);
        return createUser;
    }
}
