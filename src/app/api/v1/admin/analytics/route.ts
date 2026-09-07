import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET() {
  try {
    const analytics = dbService.getAdminAnalytics();
    const auditLogs = dbService.getAuditLogs();
    return NextResponse.json({
      success: true,
      data: {
        ...analytics,
        recentAuditLogs: auditLogs.slice(0, 10)
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
