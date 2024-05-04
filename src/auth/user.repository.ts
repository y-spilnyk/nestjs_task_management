import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
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
        try {
            await this.save(createUser);
        } catch (error) {
            if (error.code === "23505") {
                throw new ConflictException(`The user "${email}" is exist`);
            } else {
                throw new InternalServerErrorException();
            }
        }
        return createUser;
    }
}
