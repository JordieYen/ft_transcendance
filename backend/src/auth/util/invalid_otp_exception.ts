import { UnauthorizedException } from "@nestjs/common";

export class InvalidOtpException extends UnauthorizedException {
    constructor() {
        super('Wrong OTP');
    }
}
