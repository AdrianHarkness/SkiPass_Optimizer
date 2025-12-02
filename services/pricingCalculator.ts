
import { PortfolioItem, OptimizationResponse, OptimizationStrategy, CostBreakdownItem, Resort } from '../types';
import { PASS_PRICES, EPIC_DAY_PASS_PRICES, IKON_SESSION_PRICES, US_RESORTS } from '../constants';

// --- Helpers ---

// Now uses the properties on the item itself, allowing for custom/edited data
const getResortPasses = (item: PortfolioItem) => {
  return item.passAffiliation || [];
};

const getResortSeasonPassPrice = (item: PortfolioItem): number | undefined => {
  return item.seasonPassPrice;
};

// Updated to consider consecutive day discounts AND Advance Booking Timing using local item data
const calculateResortWindowCost = (item: PortfolioItem) => {
  // 1. Check for Consecutive Multi-Day Package (often cheapest if available)
  if (item.consecutiveDays && item.multiDayPrices && item.multiDayPrices[item.days]) {
    return item.multiDayPrices[item.days];
  }
  
  // 2. Check for Single Day Rate (Advance vs Window)
  const pricePerDay = (item.isAdvanceBooking && item.advanceTicketPrice) 
    ? item.advanceTicketPrice 
    : item.dayTicketPrice;

  return item.days * pricePerDay;
};

const calculateSingleItemPriceString = (item: PortfolioItem) => {
  const price = (item.isAdvanceBooking && item.advanceTicketPrice) 
    ? item.advanceTicketPrice 
    : item.dayTicketPrice;
  return `$${price}`;
};

// --- Core Optimization Logic (Internal) ---

const calculateStrategyInternal = (portfolio: PortfolioItem[]): OptimizationStrategy => {
  if (portfolio.length === 0) {
    return {
      strategyName: "No Resorts Selected",
      totalEstimatedCost: 0,
      passCost: 0,
      ticketCost: 0,
      savingsVsDayPasses: 0,
      reasoning: "Add resorts to see your plan.",
      items: [],
      purchasedPasses: []
    };
  }

  // Use the helper that reads from 'item' to support custom affiliations
  const epicResorts = portfolio.filter(p => getResortPasses(p).includes('Epic'));
  const ikonResorts = portfolio.filter(p => getResortPasses(p).includes('Ikon'));
  
  const independentResorts = portfolio.filter(p => 
    !getResortPasses(p).includes('Epic') && !getResortPasses(p).includes('Ikon')
  );

  const epicAnalysis = analyzeEpicCluster(epicResorts);
  const ikonAnalysis = analyzeIkonCluster(ikonResorts);
  const independentAnalysis = analyzeIndependents(independentResorts);

  const totalCost = epicAnalysis.cost + ikonAnalysis.cost + independentAnalysis.cost;
  const totalWindowCost = calculateTotalWindowCost(portfolio);

  const recommendedItems: CostBreakdownItem[] = [
    ...epicAnalysis.items,
    ...ikonAnalysis.items,
    ...independentAnalysis.items
  ];
  
  const purchasedPasses: string[] = [];
  if (epicAnalysis.type === 'pass') purchasedPasses.push('Epic');
  if (ikonAnalysis.type === 'pass') purchasedPasses.push('Ikon');

  return {
    strategyName: "Best Value Combination",
    totalEstimatedCost: totalCost,
    passCost: epicAnalysis.passCost + ikonAnalysis.passCost,
    ticketCost: epicAnalysis.ticketCost + ikonAnalysis.ticketCost + independentAnalysis.ticketCost,
    savingsVsDayPasses: totalWindowCost - totalCost,
    reasoning: generateReasoning(epicAnalysis, ikonAnalysis, independentAnalysis),
    items: recommendedItems,
    purchasedPasses
  };
};

// --- Exported Main Function ---

export const calculateBestStrategy = (portfolio: PortfolioItem[]): OptimizationResponse => {
  // 1. Calculate Base Strategy
  const recommended = calculateStrategyInternal(portfolio);
  
  // 2. Calculate Alternatives (Standard Rates based on selection)
  const totalStandardCost = calculateTotalWindowCost(portfolio);
  const alternatives: OptimizationStrategy[] = [{
    strategyName: "A La Carte (No Passes)",
    totalEstimatedCost: totalStandardCost,
    passCost: 0,
    ticketCost: totalStandardCost,
    savingsVsDayPasses: 0,
    reasoning: "Buying daily lift tickets individually (uses your advance/late preference).",
    items: portfolio.map(p => ({
      description: `${p.name} (${p.days} days)`,
      cost: calculateResortWindowCost(p),
      notes: `${calculateSingleItemPriceString(p)}/day avg`
    }))
  }];

  // 3. Calculate Marginal Costs
  const marginalCosts: Record<string, number> = {};
  
  for (const item of portfolio) {
    // Create a temporary portfolio with +1 day for this item
    const tempPortfolio = portfolio.map(p => 
      p.id === item.id ? { ...p, days: p.days + 1 } : p
    );
    
    const newStrategy = calculateStrategyInternal(tempPortfolio);
    const marginalCost = newStrategy.totalEstimatedCost - recommended.totalEstimatedCost;
    
    marginalCosts[item.id] = Math.max(0, marginalCost);
  }

  // 4. Calculate Suggestions
  const suggestions: Resort[] = [];
  
  if (recommended.purchasedPasses && recommended.purchasedPasses.length > 0) {
    const relevantKeywords = new Set<string>();
    portfolio.forEach(p => p.locationKeywords?.forEach(k => relevantKeywords.add(k)));
    
    const portfolioIds = new Set(portfolio.map(p => p.id));
    
    suggestions.push(...US_RESORTS.filter(r => {
      if (portfolioIds.has(r.id)) return false;
      const hasPass = r.passAffiliation?.some(pass => recommended.purchasedPasses?.includes(pass));
      if (!hasPass) return false;
      return r.locationKeywords?.some(k => relevantKeywords.has(k));
    }));
  }

  return { recommended, alternatives, marginalCosts, suggestions };
};

// --- Cluster Analyzers ---

function analyzeEpicCluster(items: PortfolioItem[]) {
  if (items.length === 0) return { cost: 0, passCost: 0, ticketCost: 0, items: [], type: 'none' };

  const totalDays = items.reduce((sum, i) => sum + i.days, 0);
  
  const bestPassPrice = PASS_PRICES.epic.local; 
  const passName = "Epic Local Pass"; 
  
  let dayPassCost = Infinity;
  let dayPassName = "";
  if (totalDays >= 1 && totalDays <= 7) {
    // @ts-ignore
    dayPassCost = EPIC_DAY_PASS_PRICES[totalDays];
    dayPassName = `${totalDays}-Day Epic Day Pass`;
  }

  let aLaCarteCost = 0;
  const aLaCarteItems: CostBreakdownItem[] = [];
  
  for (const item of items) {
    const windowCost = calculateResortWindowCost(item);
    const seasonPassPrice = getResortSeasonPassPrice(item);
    
    if (seasonPassPrice && seasonPassPrice < windowCost) {
      aLaCarteCost += seasonPassPrice;
      aLaCarteItems.push({ description: `${item.name} Season Pass`, cost: seasonPassPrice, notes: 'Individual Pass' });
    } else {
      aLaCarteCost += windowCost;
      const basePrice = item.isAdvanceBooking && item.advanceTicketPrice 
        ? "Advance" : "Window";
      const note = item.consecutiveDays ? 'Consecutive discount' : `${item.days} days @ ${basePrice}`;
      aLaCarteItems.push({ description: `${item.name} Tickets`, cost: windowCost, notes: note });
    }
  }

  if (aLaCarteCost <= bestPassPrice && aLaCarteCost <= dayPassCost) {
    return {
      cost: aLaCarteCost,
      passCost: aLaCarteItems.filter(i => i.description.includes('Pass') && !i.description.includes('Tickets')).reduce((sum, i) => sum + i.cost, 0),
      ticketCost: aLaCarteItems.filter(i => !i.description.includes('Pass') || i.description.includes('Tickets')).reduce((sum, i) => sum + i.cost, 0),
      items: aLaCarteItems,
      type: 'alacarte'
    };
  }
  
  if (dayPassCost < bestPassPrice) {
    return {
      cost: dayPassCost,
      passCost: 0,
      ticketCost: dayPassCost,
      items: [{ description: dayPassName, cost: dayPassCost, notes: `Covers ${totalDays} days at Epic resorts` }],
      type: 'daypass'
    };
  }

  return {
    cost: bestPassPrice,
    passCost: bestPassPrice,
    ticketCost: 0,
    items: [{ description: passName, cost: bestPassPrice, notes: `Covers ${items.map(i => i.name).join(', ')}` }],
    type: 'pass'
  };
}

function analyzeIkonCluster(items: PortfolioItem[]) {
  if (items.length === 0) return { cost: 0, passCost: 0, ticketCost: 0, items: [], type: 'none' };

  const totalDays = items.reduce((sum, i) => sum + i.days, 0);

  const bestPassPrice = PASS_PRICES.ikon.base;
  const passName = "Ikon Base Pass";

  let sessionCost = Infinity;
  let sessionName = "";
  if (totalDays >= 2 && totalDays <= 4) {
    // @ts-ignore
    sessionCost = IKON_SESSION_PRICES[totalDays];
    sessionName = `Ikon Session Pass ${totalDays}-Day`;
  }

  let aLaCarteCost = 0;
  const aLaCarteItems: CostBreakdownItem[] = [];

  for (const item of items) {
    const windowCost = calculateResortWindowCost(item);
    const seasonPassPrice = getResortSeasonPassPrice(item);

    if (seasonPassPrice && seasonPassPrice < windowCost) {
      aLaCarteCost += seasonPassPrice;
      aLaCarteItems.push({ description: `${item.name} Season Pass`, cost: seasonPassPrice, notes: 'Individual Pass' });
    } else {
      aLaCarteCost += windowCost;
      const basePrice = item.isAdvanceBooking && item.advanceTicketPrice 
        ? "Advance" : "Window";
      const note = item.consecutiveDays ? 'Consecutive discount' : `${item.days} days @ ${basePrice}`;
      aLaCarteItems.push({ description: `${item.name} Tickets`, cost: windowCost, notes: note });
    }
  }

  if (aLaCarteCost <= bestPassPrice && aLaCarteCost <= sessionCost) {
    return {
      cost: aLaCarteCost,
      passCost: aLaCarteItems.filter(i => i.description.includes('Pass') && !i.description.includes('Tickets')).reduce((sum, i) => sum + i.cost, 0),
      ticketCost: aLaCarteItems.filter(i => !i.description.includes('Pass') || i.description.includes('Tickets')).reduce((sum, i) => sum + i.cost, 0),
      items: aLaCarteItems,
      type: 'alacarte'
    };
  }

  if (sessionCost < bestPassPrice) {
    return {
      cost: sessionCost,
      passCost: 0,
      ticketCost: sessionCost,
      items: [{ description: sessionName, cost: sessionCost, notes: `Covers ${totalDays} days at select Ikon resorts` }],
      type: 'session'
    };
  }

  return {
    cost: bestPassPrice,
    passCost: bestPassPrice,
    ticketCost: 0,
    items: [{ description: passName, cost: bestPassPrice, notes: `Covers ${items.map(i => i.name).join(', ')}` }],
    type: 'pass'
  };
}

function analyzeIndependents(items: PortfolioItem[]) {
  if (items.length === 0) return { cost: 0, passCost: 0, ticketCost: 0, items: [], type: 'none' };

  let totalCost = 0;
  let passCost = 0;
  let ticketCost = 0;
  const breakdownItems: CostBreakdownItem[] = [];

  for (const item of items) {
    const windowCost = calculateResortWindowCost(item);
    const spPrice = getResortSeasonPassPrice(item);

    if (spPrice && spPrice < windowCost) {
      totalCost += spPrice;
      passCost += spPrice;
      breakdownItems.push({
        description: `${item.name} Season Pass`,
        cost: spPrice,
        notes: `Cheaper than ${item.days} day tickets ($${windowCost})`
      });
    } else {
      totalCost += windowCost;
      ticketCost += windowCost;
      const basePrice = item.isAdvanceBooking && item.advanceTicketPrice 
        ? "Advance" : "Window";
      const note = item.consecutiveDays ? 'Consecutive discount' : `${item.days} days @ ${basePrice}`;
      breakdownItems.push({
        description: `${item.name} Tickets`,
        cost: windowCost,
        notes: note
      });
    }
  }

  return { cost: totalCost, passCost, ticketCost, items: breakdownItems, type: 'mixed' };
}

function calculateTotalWindowCost(portfolio: PortfolioItem[]): number {
  return portfolio.reduce((sum, item) => sum + calculateResortWindowCost(item), 0);
}

function generateReasoning(epic: any, ikon: any, indy: any): string {
  const parts = [];
  
  if (epic.type === 'pass') parts.push("an Epic Pass for your Epic resorts");
  else if (epic.type === 'daypass') parts.push("an Epic Day Pass");
  else if (epic.type === 'alacarte') parts.push("individual tickets/passes for Epic resorts");

  if (ikon.type === 'pass') parts.push("an Ikon Pass for your Ikon resorts");
  else if (ikon.type === 'session') parts.push("an Ikon Session Pass");
  else if (ikon.type === 'alacarte') parts.push("individual tickets/passes for Ikon resorts");

  if (indy.cost > 0) parts.push("independent tickets/passes where required");

  if (parts.length === 0) return "No plan generated.";
  
  const text = `We recommend buying ${parts.join(', plus ')}.`;
  return text;
}
