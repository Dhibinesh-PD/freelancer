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
      } else if (decoded.role === "CLIENT") {
        // Authenticated client is strictly locked to their own account
        const clientProfile = dbService.getClientProfile(decoded.id);
        targetId = clientProfile?.id || decoded.id;
      } else {
        return NextResponse.json(
          { success: false, error: { code: "FORBIDDEN", message: "Client overview is restricted to client accounts" } },
          { status: 403 }
        );
      }
    } else {
      // Unauthenticated demo fallback or explicitly requested in demo mode
      targetId = requestedClientId || "user-cl-1";
    }

    const overview = dbService.getClientOverview(targetId);
    if (!overview) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Client profile not found" } },
        { status: 404 }
      );
    }

    // Only platform administrators receive list of all clients
    const isAdmin = decoded?.role === "ADMIN" || decoded?.role === "SUPER_ADMIN";
    const allClients = isAdmin ? dbService.getAllClients() : [];

    return NextResponse.json({
      success: true,
      data: {
        ...overview,
        allClients
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
