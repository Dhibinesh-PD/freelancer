import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let targetId: string | null = null;
    let effectiveRole: "CLIENT" | "FREELANCER" | "ADMIN" = "CLIENT";

    const { searchParams } = new URL(request.url);
    const queryFreelancerId = searchParams.get("freelancerId");
    const queryClientId = searchParams.get("clientId");
    const queryUserId = searchParams.get("userId");
    const ensureWith = searchParams.get("ensureWithId");
    const roleParam = searchParams.get("role")?.toUpperCase();

    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded) {
        if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
          effectiveRole = (roleParam === "FREELANCER" || queryFreelancerId) ? "FREELANCER" : "CLIENT";
          targetId = queryFreelancerId || queryClientId || queryUserId || decoded.id;
        } else if (decoded.role === "FREELANCER") {
          // Strictly lock to authenticated freelancer
          effectiveRole = "FREELANCER";
          const freelancer = dbService.getFreelancerProfile(decoded.id);
          targetId = freelancer?.id || decoded.id;
        } else {
          // Strictly lock to authenticated client
          effectiveRole = "CLIENT";
          const client = dbService.getClientProfile(decoded.id);
          targetId = client?.id || decoded.id;
        }
      }
    }

    if (!targetId) {
      // Unauthenticated demo fallback
      if (roleParam === "FREELANCER" || queryFreelancerId) {
        effectiveRole = "FREELANCER";
        targetId = queryFreelancerId || "fl-1";
      } else {
        effectiveRole = "CLIENT";
        targetId = queryClientId || "cl-1";
      }
    }

    // If ensureWith is requested, guarantee a conversation exists with this user
    if (ensureWith && targetId) {
      dbService.getOrCreateConversation(targetId, ensureWith);
    }

    const conversations = dbService.getConversations(targetId, effectiveRole);
    return NextResponse.json({
      success: true,
      data: conversations
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    const body = await request.json();
    const { partyAId, partyBId, freelancerId, clientId } = body;

    let partyA = partyAId || clientId || "cl-1";
    let partyB = partyBId || freelancerId || "fl-1";

    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded && decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
        if (decoded.role === "FREELANCER") {
          const fl = dbService.getFreelancerProfile(decoded.id);
          partyA = fl?.id || decoded.id;
          partyB = partyBId || clientId || "cl-1";
        } else {
          const cl = dbService.getClientProfile(decoded.id);
          partyA = cl?.id || decoded.id;
          partyB = partyBId || freelancerId || "fl-1";
        }
      }
    }

    const conv = dbService.getOrCreateConversation(partyA, partyB);
    return NextResponse.json({
      success: true,
      data: conv
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
