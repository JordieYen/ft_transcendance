import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import { isAuthenticated } from '@lib/auth'

export function authMiddleware(req: NextRequest) {
  const sessionCookie = (req.headers as any).cookie?.includes(
    "ft_transcendence_session_id",
  );
  if (!sessionCookie) {
    return NextResponse.redirect("http://localhost:3001/login");
  }
  return null;
}
