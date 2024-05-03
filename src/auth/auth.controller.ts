import { Body, Controller, Post } from "@nestjs/common";
import { User } from "./user.entity";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/create-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    createUser(@Body() authCredentialsDto: AuthCredentialsDto): Promise<User> {
        return this.authService.singhUp(authCredentialsDto);
    }
}
