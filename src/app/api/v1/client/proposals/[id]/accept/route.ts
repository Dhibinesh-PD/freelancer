import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: proposalId } = await params;
    const { searchParams } = new URL(request.url);
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let decoded: any = null;
    if (token) {
      decoded = verifyJwtToken(token);
    }

    let targetId: string = "user-cl-1";
    if (decoded) {
      if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
        targetId = searchParams.get("clientId") || decoded.id;
      } else {
        targetId = decoded.id;
      }
    } else {
      targetId = searchParams.get("clientId") || "user-cl-1";
    }

    const result = await dbService.acceptProposal(targetId, proposalId);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "OPERATION_FAILED", message: result.message } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.contract,
      message: "Proposal accepted and contract established with escrow funding."
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
