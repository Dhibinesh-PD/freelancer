import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  companyName: z.string().optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
  website: z.string().optional()
});

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let targetId: string | null = null;
    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded) targetId = decoded.id;
    }

    const { searchParams } = new URL(request.url);
    if (!targetId) {
      targetId = searchParams.get("clientId") || "user-cl-1";
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid update payload" } },
        { status: 400 }
      );
    }

    const result = await dbService.updateClientProfile(targetId, parsed.data);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "UPDATE_FAILED", message: result.message } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.client,
      message: "Company profile updated successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
