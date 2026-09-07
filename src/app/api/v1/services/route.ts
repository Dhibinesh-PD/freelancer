import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categorySlug = searchParams.get("categorySlug") || undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

    const services = await dbService.getServices({ search, categorySlug, maxPrice });
    return NextResponse.json({
      success: true,
      data: services,
      meta: { total: services.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
