import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";
import { z } from "zod";

const createJobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().default("IT & Software Development"),
  categorySlug: z.string().default("it-software"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  budgetType: z.enum(["FIXED", "HOURLY"]).default("FIXED"),
  budgetMin: z.number().positive(),
  budgetMax: z.number().positive(),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "EXPERT"]).default("INTERMEDIATE"),
  durationWeeks: z.number().positive().default(4),
  isRemote: z.boolean().default(true),
  skills: z.array(z.string()).min(1, "Specify at least one skill requirement")
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedClientId = searchParams.get("clientId");

    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let decoded: any = null;
    if (token) {
      decoded = verifyJwtToken(token);
    }

    let targetId: string = "user-cl-1";
    if (decoded) {
      if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
        targetId = requestedClientId || decoded.id;
      } else {
        targetId = decoded.id;
      }
    } else {
      targetId = requestedClientId || "user-cl-1";
    }

    const jobs = dbService.getClientJobs(targetId);
    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let decoded: any = null;
    if (token) {
      decoded = verifyJwtToken(token);
    }

    const { searchParams } = new URL(request.url);
    let targetId: string = "user-cl-1";

    if (decoded) {
      if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
        targetId = searchParams.get("clientId") || decoded.id;
      } else {
        targetId = decoded.id;
      }
    } else {
      targetId = searchParams.get("clientId") || "user-cl-1";
    }

    const body = await request.json();
    const parsed = createJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "Invalid inputs" } },
        { status: 400 }
      );
    }

    const newJob = await dbService.createJobForClient(targetId, parsed.data);
    return NextResponse.json({
      success: true,
      data: newJob,
      message: "Job project successfully created and published"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
