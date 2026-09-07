import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { verifyJwtToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const conversation = dbService.getConversationById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Conversation thread not found" } },
        { status: 404 }
      );
    }

    // Role & Privacy Authorization Isolation
    const { searchParams } = new URL(request.url);
    const queryClientId = searchParams.get("clientId");
    const queryFreelancerId = searchParams.get("freelancerId");
    const markRead = searchParams.get("markRead");
    const readerRole = (searchParams.get("role") || "CLIENT") as "CLIENT" | "FREELANCER";

    const token = request.cookies.get("auth_token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "");
    if (token) {
      const decoded = verifyJwtToken(token);
      if (decoded && decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
        const userClient = dbService.getClientProfile(decoded.id);
        const userFreelancer = dbService.getFreelancerProfile(decoded.id);

        const isClientParticipant = 
          (userClient && (conversation.clientId === userClient.id || conversation.clientId === userClient.userId)) ||
          conversation.clientId === decoded.id;

        const isFreelancerParticipant = 
          (userFreelancer && (conversation.freelancerId === userFreelancer.id || conversation.freelancerId === userFreelancer.userId)) ||
          conversation.freelancerId === decoded.id;

        if (!isClientParticipant && !isFreelancerParticipant) {
          return NextResponse.json(
            { success: false, error: { code: "FORBIDDEN", message: "Access denied. You are not an authorized participant in this conversation." } },
            { status: 403 }
          );
        }
      }
    } else {
      // Unauthenticated access check: if explicit participant ID is specified, verify match
      if (queryClientId || queryFreelancerId) {
        const isClientMatch = queryClientId && (conversation.clientId === queryClientId || conversation.clientId === `cl-${queryClientId}` || conversation.clientId === `user-${queryClientId}`);
        const isFreelancerMatch = queryFreelancerId && (conversation.freelancerId === queryFreelancerId || conversation.freelancerId === `fl-${queryFreelancerId}` || conversation.freelancerId === `user-${queryFreelancerId}`);
        if (!isClientMatch && !isFreelancerMatch) {
          return NextResponse.json(
            { success: false, error: { code: "FORBIDDEN", message: "Access denied. You are not an authorized participant in this conversation." } },
            { status: 403 }
          );
        }
      }
    }

    if (markRead === "true") {
      dbService.markMessagesAsRead(conversationId, readerRole);
    }

    const messages = dbService.getConversationMessages(conversationId);

    return NextResponse.json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}
