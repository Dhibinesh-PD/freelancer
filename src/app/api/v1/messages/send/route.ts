import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";
import { z } from "zod";

const sendSchema = z.object({
  conversationId: z.string().optional(),
  freelancerId: z.string().optional(),
  clientId: z.string().optional(),
  senderId: z.string().optional(),
  content: z.string().min(1, "Message content cannot be empty"),
  senderRole: z.enum(["CLIENT", "FREELANCER"]).default("CLIENT")
});

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    let targetSenderId: string | null = null;
    let tokenRole: "CLIENT" | "FREELANCER" = "CLIENT";

    let decodedUser: any = null;
    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded) {
        decodedUser = decoded;
        targetSenderId = decoded.id;
        tokenRole = decoded.role === "FREELANCER" ? "FREELANCER" : "CLIENT";
      }
    }

    const { searchParams } = new URL(request.url);
    if (!targetSenderId) {
      targetSenderId = searchParams.get("senderId") || "user-cl-1";
    }

    const body = await request.json();
    const parsed = sendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message || "Invalid message format" } },
        { status: 400 }
      );
    }

    // Enforce identity if authenticated (no impersonation)
    const isAdmin = decodedUser && (decodedUser.role === "ADMIN" || decodedUser.role === "SUPER_ADMIN");
    const effectiveRole = (decodedUser && !isAdmin) ? tokenRole : (body.senderRole || tokenRole);
    const finalSenderId = (decodedUser && !isAdmin) ? targetSenderId : (parsed.data.senderId || targetSenderId);

    // Verify conversation participant authorization if conversationId is specified
    if (parsed.data.conversationId) {
      const conv = dbService.getConversationById(parsed.data.conversationId);
      if (!conv) {
        return NextResponse.json(
          { success: false, error: { code: "NOT_FOUND", message: "Conversation thread not found" } },
          { status: 404 }
        );
      }
      if (decodedUser && !isAdmin) {
        const userClient = dbService.getClientProfile(decodedUser.id);
        const userFreelancer = dbService.getFreelancerProfile(decodedUser.id);

        const isClientPart = (userClient && (conv.clientId === userClient.id || conv.clientId === userClient.userId)) || conv.clientId === decodedUser.id;
        const isFreelancerPart = (userFreelancer && (conv.freelancerId === userFreelancer.id || conv.freelancerId === userFreelancer.userId)) || conv.freelancerId === decodedUser.id;

        if (!isClientPart && !isFreelancerPart) {
          return NextResponse.json(
            { success: false, error: { code: "FORBIDDEN", message: "You are not authorized to send messages to this conversation." } },
            { status: 403 }
          );
        }
      }
    }

    const result = await dbService.sendMessage({
      conversationId: parsed.data.conversationId,
      clientIdOrUserId: parsed.data.clientId || finalSenderId,
      freelancerId: parsed.data.freelancerId,
      senderId: finalSenderId,
      content: parsed.data.content,
      senderRole: effectiveRole
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { code: "SEND_FAILED", message: result.message || "Failed to send message" } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: result.message,
        conversation: result.conversation
      },
      message: "Message sent successfully"
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
