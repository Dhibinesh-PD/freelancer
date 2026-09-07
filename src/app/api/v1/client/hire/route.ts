import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";
import { z } from "zod";

const hireSchema = z.object({
  freelancerId: z.string().min(1, "Freelancer ID is required"),
  projectTitle: z.string().min(3, "Project title is required"),
  description: z.string().default("Direct Hire engagement initialized with funded milestone escrow."),
  totalAmount: z.number().positive("Amount must be greater than 0"),
  deliveryWeeks: z.number().positive().default(4),
  initialMilestoneTitle: z.string().optional(),
  initialMilestoneAmount: z.number().positive().optional()
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let targetClientId: string | null = null;
    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded) targetClientId = decoded.id;
    }

    const { searchParams } = new URL(request.url);
    if (!targetClientId) {
      targetClientId = searchParams.get("clientId") || "user-cl-1";
    }

    const body = await request.json();
    const parsed = hireSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "Invalid hire details" } },
        { status: 400 }
      );
    }

    const result = await dbService.hireFreelancer({
      clientIdOrUserId: targetClientId,
      freelancerId: parsed.data.freelancerId,
      projectTitle: parsed.data.projectTitle,
      description: parsed.data.description,
      totalAmount: parsed.data.totalAmount,
      deliveryWeeks: parsed.data.deliveryWeeks,
      initialMilestoneTitle: parsed.data.initialMilestoneTitle,
      initialMilestoneAmount: parsed.data.initialMilestoneAmount
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "HIRE_FAILED", message: result.message || "Could not complete hire" } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        contract: result.contract,
        conversation: result.conversation
      },
      message: `Direct hire confirmed! Contract ${result.contract?.id} created and $${parsed.data.totalAmount} locked in escrow.`
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
