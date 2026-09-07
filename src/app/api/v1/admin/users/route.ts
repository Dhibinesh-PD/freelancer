import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { z } from "zod";

const updateUserStatusSchema = z.object({
  userId: z.string(),
  status: z.enum(["ACTIVE", "SUSPENDED", "VERIFIED", "BANNED"])
});

export async function GET() {
  try {
    const users = await dbService.getUsers();
    // Strip passwordHash before sending
    const sanitized = users.map(u => ({
      id: u.id,
      email: u.email,
      username: u.username,
      name: u.name,
      role: u.role,
      status: u.status,
      emailVerified: u.emailVerified,
      companyName: u.companyName
    }));

    return NextResponse.json({
      success: true,
      data: sanitized,
      meta: { total: sanitized.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = updateUserStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid payload" } },
        { status: 400 }
      );
    }

    const result = await dbService.updateUserStatus(parsed.data.userId, parsed.data.status);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: result.message } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.user,
      message: `User status changed to ${parsed.data.status}`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
