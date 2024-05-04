import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class AuthCredentialsDto {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1
    })
    password: string;
}
