import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private readonly eManager: EntityManager) {
        super(User, eManager);
    }

    async userSignUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { email, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const createUser = this.create({
            email,
            password: hashedPassword
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
    }

    async userSignIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;
        const user = await this.findOneBy({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            return "success";
        } else {
            throw new UnauthorizedException("Verify your credentials");
        }
    }
}
