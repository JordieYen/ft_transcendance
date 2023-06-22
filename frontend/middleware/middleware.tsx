import { NextRequest } from "next/server";
import { isAuthenticated } from '@lib/auth'

export function middleware(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return {
            status: 302,
            headers: {
                location: '/login',
            },
        };
    }
}
