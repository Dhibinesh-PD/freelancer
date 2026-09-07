import { NextRequest, NextResponse } from "next/server";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ success: false, data: null });
  }

  const user = verifyJwtToken(token);
  if (!user) {
    return NextResponse.json({ success: false, data: null });
  }

  return NextResponse.json({ success: true, data: user });
}
