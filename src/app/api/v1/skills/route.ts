import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;
    const skills = dbService.getSkills(query);
    return NextResponse.json({
      success: true,
      data: skills,
      meta: { total: skills.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
