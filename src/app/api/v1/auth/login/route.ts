import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { signJwtToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  requiredRole: z.enum(["ADMIN", "CLIENT", "FREELANCER"]).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid email or password format" } },
        { status: 400 }
      );
    }

    const result = await dbService.authenticate(
      parsed.data.email,
      parsed.data.password,
      parsed.data.requiredRole
    );

    if (!result.success || !result.user) {
      const statusCode = result.error === "ROLE_MISMATCH" ? 403 : 401;
      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.error || "INVALID_CREDENTIALS",
            message: result.message || "Incorrect email or password"
          }
        },
        { status: statusCode }
      );
    }

    const user = result.user;

    const token = signJwtToken({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      roles: user.roles || [user.role]
    });

    const redirectUrl =
      user.role === "SUPER_ADMIN" || user.role === "ADMIN"
        ? "/admin"
        : user.role === "FREELANCER"
        ? "/dashboard/freelancer"
        : "/dashboard/client";

    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        roles: user.roles
      },
      redirectUrl,
      message: "Logged in successfully"
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
