import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; mId: string }> }
) {
  try {
    const { id, mId } = await params;
    const result = await dbService.approveMilestone(id, mId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: result.message } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { contractId: id, milestoneId: mId, status: "APPROVED" },
      message: result.message
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
