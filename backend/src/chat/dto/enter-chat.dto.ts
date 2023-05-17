import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ChatDto {
	@IsString()
	@IsNotEmpty()
	ChannelName: string;

	@IsString()
	@IsNotEmpty()
	ChannelType: string;

	@IsString()
	@IsOptional()
	ChannelPassword? : string;
}