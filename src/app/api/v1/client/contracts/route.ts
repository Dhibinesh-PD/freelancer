import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedClientId = searchParams.get("clientId");

    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let decoded: any = null;
    if (token) {
      decoded = verifyJwtToken(token);
    }

    let targetId: string = "user-cl-1";
    if (decoded) {
      if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
        targetId = requestedClientId || decoded.id;
      } else {
        targetId = decoded.id;
      }
    } else {
      targetId = requestedClientId || "user-cl-1";
    }

    const contracts = dbService.getClientContracts(targetId);
    return NextResponse.json({ success: true, data: contracts });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
