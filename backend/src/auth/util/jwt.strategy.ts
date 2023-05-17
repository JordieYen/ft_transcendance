// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { AuthService } from "../services/auth.service";

// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(
//         private readonly authService: AuthService
//     ) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             ignoreExpiration: false,
//             secretOrKey: process.env.JWT_SECRET
//         })
//         console.log('jwt strategy', process.env.JWT_SECRET);
        
//     }

//     async validate(payload: any) {
//         // Validate and retrieve user information from the payload (e.g., by calling the AuthService)
//         return await this.authService.validateUser(payload.username);
//     }
// }
