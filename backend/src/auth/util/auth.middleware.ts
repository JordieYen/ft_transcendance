import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const isAuthRoute = req.baseUrl === '/auth' && (req.path === '/login' || req.path === '/callback');
        if (!isAuthRoute && !req.isAuthenticated()) {
            console.log('user authentication', req.isUnauthenticated());
            return res.redirect(`${process.env.NEXT_HOST}/login`);
            // return res.status(401).json({ message: 'Unauthorized'})
        }
        next();
    }
}
