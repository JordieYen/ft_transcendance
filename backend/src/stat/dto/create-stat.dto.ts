import { IsNotEmpty } from "class-validator";

export class CreateStatDto {
    @IsNotEmpty()
    userId: number;

    @IsNotEmpty()
    wins: number;

    @IsNotEmpty()
    losses: number;

    @IsNotEmpty()
    mmr: number;
}
