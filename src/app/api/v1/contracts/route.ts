import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET() {
  try {
    const contracts = await dbService.getContracts();
    return NextResponse.json({
      success: true,
      data: contracts,
      meta: { total: contracts.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
