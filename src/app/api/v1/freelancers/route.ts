import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const minRate = searchParams.get("minRate") ? Number(searchParams.get("minRate")) : undefined;
    const maxRate = searchParams.get("maxRate") ? Number(searchParams.get("maxRate")) : undefined;
    const topRated = searchParams.get("topRated") === "true";

    const freelancers = await dbService.getFreelancers({ search, category, minRate, maxRate, topRated });
    return NextResponse.json({
      success: true,
      data: freelancers,
      meta: { total: freelancers.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
