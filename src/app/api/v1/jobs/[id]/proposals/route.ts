import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { z } from "zod";

const proposalSchema = z.object({
  freelancerId: z.string().default("fl-1"),
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters"),
  bidAmount: z.number().positive("Bid amount must be greater than zero"),
  deliveryDays: z.number().positive("Delivery days must be at least 1")
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const proposals = await dbService.getProposalsForJob(id);
    return NextResponse.json({
      success: true,
      data: proposals,
      meta: { total: proposals.length }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = proposalSchema.safeParse(body);

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

    const newProposal = await dbService.submitProposal(id, parsed.data.freelancerId, {
      coverLetter: parsed.data.coverLetter,
      bidAmount: parsed.data.bidAmount,
      deliveryDays: parsed.data.deliveryDays
    });

    return NextResponse.json(
      {
        success: true,
        data: newProposal,
        message: "Proposal submitted successfully."
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
