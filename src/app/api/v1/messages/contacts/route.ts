import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let userRole: "CLIENT" | "FREELANCER" | "ADMIN" = "CLIENT";

    const { searchParams } = new URL(request.url);
    const roleParam = searchParams.get("role")?.toUpperCase();

    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded?.role === "FREELANCER") {
        userRole = "FREELANCER";
      } else if (decoded?.role === "ADMIN" || decoded?.role === "SUPER_ADMIN") {
        userRole = (roleParam === "CLIENT" || roleParam === "FREELANCER") ? roleParam : "ADMIN";
      } else {
        userRole = "CLIENT";
      }
    } else if (roleParam === "CLIENT" || roleParam === "FREELANCER" || roleParam === "ADMIN") {
      userRole = roleParam;
    }

    const contacts = dbService.getContacts(userRole);
    return NextResponse.json({
      success: true,
      data: contacts
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
