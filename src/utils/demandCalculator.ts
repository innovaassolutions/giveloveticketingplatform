export interface DemandMetrics {
  sellThroughRate: number;
  timeUrgency: number;
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEAK';
  multiplier: number;
  suggestedUplift: number;
}

export function calculateDemandMultiplier(eventData: any, baseUplift: number = 5): DemandMetrics {
  const { ticketTypes, date } = eventData;

  // Calculate average sellthrough across all ticket types
  const avgSellthrough = ticketTypes.reduce((total: number, type: any) => {
    return total + ((type.total - type.available) / type.total);
  }, 0) / ticketTypes.length;

  // Time urgency (closer to event date = higher demand)
  const daysToEvent = Math.max(1, (new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const timeMultiplier = daysToEvent < 30 ? 1.3 : daysToEvent < 60 ? 1.1 : 1.0;

  // Demand level and multiplier based on sellthrough
  let demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEAK';
  let demandMultiplier: number;

  if (avgSellthrough > 0.8) {
    demandLevel = 'PEAK';
    demandMultiplier = 2.5;
  } else if (avgSellthrough > 0.6) {
    demandLevel = 'HIGH';
    demandMultiplier = 2.0;
  } else if (avgSellthrough > 0.3) {
    demandLevel = 'MEDIUM';
    demandMultiplier = 1.5;
  } else {
    demandLevel = 'LOW';
    demandMultiplier = 1.0;
  }

  const finalMultiplier = demandMultiplier * timeMultiplier;
  const suggestedUplift = Math.min(200, Math.round(baseUplift * finalMultiplier));

  return {
    sellThroughRate: Math.round(avgSellthrough * 100),
    timeUrgency: timeMultiplier,
    demandLevel,
    multiplier: Math.round(finalMultiplier * 100) / 100,
    suggestedUplift
  };
}

export function getDemandLevelColor(level: string): string {
  switch (level) {
    case 'PEAK': return 'text-red-400';
    case 'HIGH': return 'text-orange-400';
    case 'MEDIUM': return 'text-yellow-400';
    case 'LOW': return 'text-green-400';
    default: return 'text-gray-400';
  }
}

export function getDemandLevelBg(level: string): string {
  switch (level) {
    case 'PEAK': return 'bg-red-500/10 border-red-400/30';
    case 'HIGH': return 'bg-orange-500/10 border-orange-400/30';
    case 'MEDIUM': return 'bg-yellow-500/10 border-yellow-400/30';
    case 'LOW': return 'bg-green-500/10 border-green-400/30';
    default: return 'bg-gray-500/10 border-gray-400/30';
  }
}