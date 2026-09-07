import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET() {
  try {
    const categories = dbService.getCategories();
    return NextResponse.json({
      success: true,
      data: categories,
      meta: { total: categories.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
