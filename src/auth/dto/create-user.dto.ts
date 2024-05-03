import { IsEmail, IsNotEmpty, Min } from "class-validator";

export class AuthCredentialsDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Min(6)
    password: string;
}
