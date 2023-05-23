
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @MinLength(3)
    username: string;

    @IsOptional()
    @IsNumber()
    intra_uid?: number;

    @IsOptional()
    avatar?: string;

    @IsOptional()
    online?: boolean;
}
