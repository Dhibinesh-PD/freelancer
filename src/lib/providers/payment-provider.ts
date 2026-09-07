export interface PaymentIntentResult {
  transactionId: string;
  amount: number;
  currency: string;
  status: "SUCCEEDED" | "PENDING" | "FAILED" | "REFUNDED";
  escrowStatus: "HELD" | "RELEASED" | "REFUNDED";
  fee: number;
  netAmount: number;
}

export interface IPaymentProvider {
  createEscrowDeposit(amount: number, currency: string, metadata: { contractId: string; milestoneId: string; payerId: string; payeeId: string }): Promise<PaymentIntentResult>;
  releaseEscrow(transactionId: string, amount: number): Promise<PaymentIntentResult>;
  refundEscrow(transactionId: string, amount: number): Promise<PaymentIntentResult>;
}

export class MockPaymentProvider implements IPaymentProvider {
  async createEscrowDeposit(amount: number, currency: string, metadata: { contractId: string; milestoneId: string; payerId: string; payeeId: string }): Promise<PaymentIntentResult> {
    const fee = Math.round(amount * 0.10 * 100) / 100;
    const netAmount = amount - fee;
    return {
      transactionId: `tx_mock_${Date.now()}`,
      amount,
      currency,
      status: "SUCCEEDED",
      escrowStatus: "HELD",
      fee,
      netAmount
    };
  }

  async releaseEscrow(transactionId: string, amount: number): Promise<PaymentIntentResult> {
    const fee = Math.round(amount * 0.10 * 100) / 100;
    return {
      transactionId,
      amount,
      currency: "USD",
      status: "SUCCEEDED",
      escrowStatus: "RELEASED",
      fee,
      netAmount: amount - fee
    };
  }

  async refundEscrow(transactionId: string, amount: number): Promise<PaymentIntentResult> {
    return {
      transactionId,
      amount,
      currency: "USD",
      status: "REFUNDED",
      escrowStatus: "REFUNDED",
      fee: 0,
      netAmount: amount
    };
  }
}

export const paymentProvider = new MockPaymentProvider();
