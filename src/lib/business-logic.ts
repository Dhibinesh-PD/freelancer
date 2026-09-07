export function calculateCommission(amount: number, categorySlug?: string): { feePercentage: number; platformFee: number; netFreelancerAmount: number } {
  // Sliding scale / configurable commission
  let feePercentage = 10; // Default 10%
  if (categorySlug === "legal-contracts" || categorySlug === "finance-accounting") {
    feePercentage = 12; // Specialized domain surcharge
  }
  if (amount >= 5000) {
    feePercentage = 7; // Volume discount over $5,000
  }

  const platformFee = Math.round((amount * (feePercentage / 100)) * 100) / 100;
  const netFreelancerAmount = Math.round((amount - platformFee) * 100) / 100;

  return { feePercentage, platformFee, netFreelancerAmount };
}

export function calculateProfileCompletion(profile: {
  avatarUrl?: string | null;
  title?: string | null;
  overview?: string | null;
  skillsCount?: number;
  portfolioCount?: number;
  isVerified?: boolean;
}): number {
  let score = 0;
  if (profile.avatarUrl) score += 15;
  if (profile.title) score += 15;
  if (profile.overview && profile.overview.length > 50) score += 20;
  if (profile.skillsCount && profile.skillsCount >= 3) score += 20;
  if (profile.portfolioCount && profile.portfolioCount >= 1) score += 15;
  if (profile.isVerified) score += 15;
  return Math.min(score, 100);
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount);
}
