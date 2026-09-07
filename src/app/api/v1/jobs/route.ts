import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { z } from "zod";

const createJobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(2),
  categorySlug: z.string().min(2),
  budgetType: z.enum(["FIXED", "HOURLY"]),
  budgetMin: z.number().positive(),
  budgetMax: z.number().positive(),
  experienceLevel: z.enum(["ENTRY", "INTERMEDIATE", "EXPERT"]),
  durationWeeks: z.number().positive(),
  isRemote: z.boolean().default(true),
  skills: z.array(z.string()).min(1, "Select at least 1 skill")
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const categorySlug = searchParams.get("categorySlug") || undefined;
    const budgetType = searchParams.get("budgetType") || undefined;

    const jobs = await dbService.getJobs({ search, categorySlug, budgetType });
    return NextResponse.json({
      success: true,
      data: jobs,
      meta: { total: jobs.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createJobSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: parsed.error.issues
          }
        },
        { status: 400 }
      );
    }

    const createdJob = await dbService.createJob(parsed.data);
    return NextResponse.json(
      {
        success: true,
        data: createdJob,
        message: "Job posting published successfully."
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
