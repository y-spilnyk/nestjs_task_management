import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/create-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    createUser(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.singhUp(authCredentialsDto);
    }
}
