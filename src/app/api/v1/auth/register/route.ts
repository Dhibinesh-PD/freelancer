import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { signJwtToken } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Please provide a valid work or personal email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().optional(),
  role: z.enum(["CLIENT", "FREELANCER", "ADMIN"]),
  adminSecret: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  title: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  bio: z.string().optional(),
  country: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid input parameters";
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: errorMsg } },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Security check for administrator registration
    if (data.role === "ADMIN") {
      const validSecret = process.env.ADMIN_SECRET || "ApexAdmin2026!";
      if (data.adminSecret !== validSecret) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED_ADMIN_CREATION",
              message: "Invalid administrator provisioning key. Administrator creation requires authorized credentials."
            }
          },
          { status: 403 }
        );
      }
    }

    const result = await dbService.createUser({
      email: data.email,
      password: data.password,
      name: data.name,
      username: data.username,
      role: data.role,
      companyName: data.companyName,
      industry: data.industry,
      title: data.title,
      skills: data.skills,
      hourlyRate: data.hourlyRate,
      bio: data.bio,
      country: data.country
    });

    if (!result.success || !result.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.error || "REGISTRATION_FAILED",
            message: result.message || "Could not register account"
          }
        },
        { status: 400 }
      );
    }

    const user = result.user;

    const token = signJwtToken({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role as any,
      roles: (user.roles || [user.role]) as any
    });

    const redirectUrl =
      user.role === "ADMIN" || user.role === "SUPER_ADMIN"
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
      message: `Account created successfully as ${user.role}`
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
