import { NextRequest, NextResponse } from 'next/server';
import { analyzeResults } from '@/lib/ai';
import type { FrameworkResults, Decision } from '@/types';

// Fallback analysis when AI is not available
function calculateLocalAnalysis(frameworks: FrameworkResults) {
  const results: { framework: string; recommendation: Decision | 'inconclusive'; confidence: number; reasoning: string }[] = [];

  // Competition framework
  const { performancePressure, costPressure } = frameworks.competition;
  if (frameworks.competition.completed) {
    if (performancePressure >= 4 && costPressure < 4) {
      results.push({ framework: 'Competition', recommendation: 'make', confidence: 75, reasoning: 'High performance pressure favors in-house control' });
    } else if (costPressure >= 4 && performancePressure < 4) {
      results.push({ framework: 'Competition', recommendation: 'buy', confidence: 70, reasoning: 'Cost pressure suggests leveraging external efficiency' });
    } else if (performancePressure >= 4 && costPressure >= 4) {
      results.push({ framework: 'Competition', recommendation: 'partner', confidence: 65, reasoning: 'Balanced pressures suggest partnership' });
    } else {
      results.push({ framework: 'Competition', recommendation: 'inconclusive', confidence: 50, reasoning: 'Low pressures make this dimension less decisive' });
    }
  }

  // Technology framework
  if (frameworks.technology.completed) {
    const { currentPhase, emergingThreat } = frameworks.technology;
    if (currentPhase === 'early' && !emergingThreat) {
      results.push({ framework: 'Technology', recommendation: 'make', confidence: 80, reasoning: 'Early-stage technology benefits from in-house learning' });
    } else if (currentPhase === 'plateau' || emergingThreat) {
      results.push({ framework: 'Technology', recommendation: 'partner', confidence: 70, reasoning: 'Technology uncertainty favors flexible arrangements' });
    } else {
      results.push({ framework: 'Technology', recommendation: 'buy', confidence: 65, reasoning: 'Mature technology can be efficiently sourced' });
    }
  }

  // Transaction Cost framework
  if (frameworks.transactionCost.completed) {
    const tceScore = (frameworks.transactionCost.assetSpecificity + frameworks.transactionCost.uncertainty + frameworks.transactionCost.frequency) / 3;
    if (tceScore >= 4) {
      results.push({ framework: 'Transaction Costs', recommendation: 'make', confidence: 78, reasoning: 'High TCE factors favor hierarchy' });
    } else if (tceScore <= 2) {
      results.push({ framework: 'Transaction Costs', recommendation: 'buy', confidence: 72, reasoning: 'Low TCE factors favor market transactions' });
    } else {
      results.push({ framework: 'Transaction Costs', recommendation: 'partner', confidence: 60, reasoning: 'Moderate TCE suggests hybrid governance' });
    }
  }

  // Hold-Up Risk framework
  if (frameworks.holdUpRisk.completed) {
    const holdUpScore = (frameworks.holdUpRisk.switchingCosts + frameworks.holdUpRisk.relationshipSpecificity + frameworks.holdUpRisk.informationAsymmetry) / 3;
    if (holdUpScore >= 4) {
      results.push({ framework: 'Hold-Up Risk', recommendation: 'make', confidence: 82, reasoning: 'High hold-up risk justifies vertical integration' });
    } else if (holdUpScore <= 2) {
      results.push({ framework: 'Hold-Up Risk', recommendation: 'buy', confidence: 68, reasoning: 'Low hold-up risk makes outsourcing safe' });
    } else {
      results.push({ framework: 'Hold-Up Risk', recommendation: 'partner', confidence: 55, reasoning: 'Moderate risk can be managed through partnerships' });
    }
  }

  // Bargaining framework
  if (frameworks.bargaining.completed) {
    const { supplierPower, buyerAlternatives, urgency } = frameworks.bargaining;
    const positionScore = ((6 - supplierPower) + buyerAlternatives + (6 - urgency)) / 3;
    if (positionScore >= 4) {
      results.push({ framework: 'Bargaining', recommendation: 'buy', confidence: 70, reasoning: 'Strong position enables favorable market terms' });
    } else if (positionScore <= 2) {
      results.push({ framework: 'Bargaining', recommendation: 'make', confidence: 75, reasoning: 'Weak position suggests reducing external dependency' });
    } else {
      results.push({ framework: 'Bargaining', recommendation: 'partner', confidence: 58, reasoning: 'Balanced position works for partnership' });
    }
  }

  // Additional dimensions
  if (frameworks.additional.completed) {
    const { timeHorizon, capabilityGap, optionality } = frameworks.additional;
    if (timeHorizon === 'short' || capabilityGap >= 4) {
      results.push({ framework: 'Additional', recommendation: 'partner', confidence: 60, reasoning: 'Time or capability constraints favor partnerships' });
    } else if (timeHorizon === 'long' && capabilityGap <= 2) {
      results.push({ framework: 'Additional', recommendation: 'make', confidence: 65, reasoning: 'Long horizon with capability supports in-house' });
    } else if (optionality >= 4) {
      results.push({ framework: 'Additional', recommendation: 'buy', confidence: 55, reasoning: 'High optionality need favors flexible sourcing' });
    } else {
      results.push({ framework: 'Additional', recommendation: 'inconclusive', confidence: 50, reasoning: 'Mixed signals from additional factors' });
    }
  }

  // Calculate weighted results
  const weights = { make: 0, buy: 0, partner: 0 };
  let totalWeight = 0;

  results.forEach(r => {
    if (r.recommendation !== 'inconclusive') {
      weights[r.recommendation] += r.confidence;
      totalWeight += r.confidence;
    }
  });

  const weightedResult = {
    make: totalWeight > 0 ? Math.round((weights.make / totalWeight) * 100) : 33,
    buy: totalWeight > 0 ? Math.round((weights.buy / totalWeight) * 100) : 33,
    partner: totalWeight > 0 ? Math.round((weights.partner / totalWeight) * 100) : 34,
  };

  // Determine primary recommendation
  const maxWeight = Math.max(weightedResult.make, weightedResult.buy, weightedResult.partner);
  const primaryRecommendation: Decision = weightedResult.make === maxWeight ? 'make' :
    weightedResult.buy === maxWeight ? 'buy' : 'partner';

  // Check if frameworks conflict significantly
  const spread = maxWeight - Math.min(weightedResult.make, weightedResult.buy, weightedResult.partner);
  const conflictingFrameworks = spread < 20;

  return {
    frameworkResults: results,
    weightedResult,
    primaryRecommendation,
    conflictingFrameworks,
    feedback: [],
  };
}

export async function POST(request: NextRequest) {
  try {
    const { scenario, stance, frameworks } = await request.json();

    if (!scenario || !stance || !frameworks) {
      return NextResponse.json(
        { error: 'Scenario, stance, and frameworks are required' },
        { status: 400 }
      );
    }

    // Try AI analysis first
    try {
      const analysis = await analyzeResults(scenario, stance, frameworks);
      return NextResponse.json(analysis);
    } catch (aiError) {
      console.warn('AI analysis failed, using local calculation:', aiError);
      // Fallback to local calculation
      const localAnalysis = calculateLocalAnalysis(frameworks);
      return NextResponse.json(localAnalysis);
    }
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze results. Please try again.' },
      { status: 500 }
    );
  }
}
