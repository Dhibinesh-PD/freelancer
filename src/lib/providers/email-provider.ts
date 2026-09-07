export interface EmailPayload {
  to: string;
  subject: string;
  template: "WELCOME" | "PROPOSAL_RECEIVED" | "CONTRACT_AWARDED" | "MILESTONE_FUNDED" | "MILESTONE_APPROVED";
  variables: Record<string, any>;
}

export interface IEmailProvider {
  sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }>;
}

export class ConsoleEmailProvider implements IEmailProvider {
  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
    const messageId = `msg_${Date.now()}`;
    console.log(`[EmailProvider] Sent ${payload.template} to ${payload.to} (Subject: ${payload.subject})`);
    return { success: true, messageId };
  }
}

export const emailProvider = new ConsoleEmailProvider();
