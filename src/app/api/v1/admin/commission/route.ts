import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { z } from "zod";

const commissionSchema = z.object({
  percentage: z.number().min(1).max(50)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = commissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Percentage must be between 1 and 50" } },
        { status: 400 }
      );
    }

    const result = dbService.updatePlatformCommission(parsed.data.percentage);
    return NextResponse.json({
      success: true,
      data: result,
      message: `Platform commission rate updated to ${parsed.data.percentage}%`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
