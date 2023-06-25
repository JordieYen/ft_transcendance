import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from "next/server";
// import { isAuthenticated } from '@lib/auth'

function checkSession(request: NextRequest) {
    // const cookiesHeader = request.headers['cookie'];
    const cookiesHeader = (request.headers as any).cookie;

    console.log('Cookies: ', cookiesHeader);
    
    if (cookiesHeader) {
        const cookies = cookiesHeader.split('; ');
        const sessionCookie = cookies.find((cookie: any) => cookie.startsWith('ft_transcendence_session_id='));
        if (sessionCookie) {
            const sessionId = sessionCookie.split('=')[1];
            if (sessionId) {
                console.log('Session ID: ', sessionId);
                return true;
            }
        }
    }
    return false;
}

export function middleware(request: NextRequest) {
    if (!checkSession(request)) {
        console.log('redirect to login from middleware.ts');
        return NextResponse.redirect('http://localhost:3001/login');
    }
}


export function authMiddleware(req: NextRequest) {
    const sessionCookie = (req.headers as any).cookie?.includes('ft_transcendence_session_id');
    console.log('sessionCookie', sessionCookie);
    
    if (!sessionCookie) {
        console.log('redirect to login from middleware.ts');
        
        return NextResponse.redirect('http://localhost:3001/login');
    }

    return null;
}

