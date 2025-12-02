
export interface Resort {
  id: string;
  name: string;
  region: string;
  passAffiliation?: string[]; // e.g., ['Ikon', 'Epic', 'Mountain Collective']
  dayTicketPrice: number; // Representative single-day window rate (Last Minute / Holiday) for 2024/25
  advanceTicketPrice?: number; // Representative price if bought 7+ days in advance online
  seasonPassPrice?: number; // Price of the specific resort's own season pass (if applicable/common)
  multiDayPrices?: Record<number, number>; // Total price for N consecutive days (e.g. {3: 250})
  locationKeywords?: string[]; // e.g. ["Denver", "Salt Lake City", "Bay Area"]
  websiteUrl?: string; // URL to official resort website
}

export interface PortfolioItem extends Resort {
  days: number;
  consecutiveDays?: boolean;
  isAdvanceBooking?: boolean; // true = purchasing >7 days in advance (cheaper), false = window/last minute
}

export interface CostBreakdownItem {
  description: string;
  cost: number;
  notes?: string;
}

export interface OptimizationStrategy {
  strategyName: string;
  totalEstimatedCost: number;
  passCost: number;
  ticketCost: number;
  savingsVsDayPasses: number;
  items: CostBreakdownItem[];
  reasoning: string;
  purchasedPasses?: string[]; // e.g. ['Epic', 'Ikon']
}

export interface OptimizationResponse {
  recommended: OptimizationStrategy;
  alternatives: OptimizationStrategy[];
  marginalCosts: Record<string, number>; // Maps resortId -> cost to add 1 day
  suggestions: Resort[]; // Free/included resorts nearby
}
