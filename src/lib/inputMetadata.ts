// Metadata for all inputs across frameworks
// Used for generating AI hints specific to each input

export interface InputMetadata {
  id: string;
  label: string;
  description: string;
  lowLabel: string;
  highLabel: string;
  type: 'slider' | 'buttonGroup';
  hintGuidance: string;
}

export const INPUT_METADATA: Record<string, Record<string, InputMetadata>> = {
  competition: {
    performancePressure: {
      id: 'performancePressure',
      label: 'Performance Pressure',
      description: 'How much does the market demand continuous performance improvements?',
      lowLabel: 'Commodity market',
      highLabel: 'Rapid innovation required',
      type: 'slider',
      hintGuidance: 'Help the student assess whether this industry rewards performance differentiation. Consider: How fast is the technology improving? Are customers willing to pay premiums for better performance? Is there a clear performance leader setting the pace?'
    },
    costPressure: {
      id: 'costPressure',
      label: 'Cost Reduction Pressure',
      description: 'How intense is the pressure to reduce costs in this component/capability?',
      lowLabel: 'Premium tolerated',
      highLabel: 'Aggressive cost competition',
      type: 'slider',
      hintGuidance: 'Help the student think about pricing competition. Consider: Is the market commoditizing? Are margins shrinking across the industry? What are competitors doing to reduce costs? Is price the primary basis of competition?'
    }
  },
  technology: {
    currentPhase: {
      id: 'currentPhase',
      label: 'Technology Lifecycle Phase',
      description: 'Where is the current technology in its S-curve lifecycle?',
      lowLabel: 'Early stage',
      highLabel: 'Approaching limits',
      type: 'buttonGroup',
      hintGuidance: 'Help the student identify where this technology sits on the S-curve. Consider: Is it nascent with rapid improvements still happening? Is it mature with predictable incremental gains? Is it approaching physical or practical limits? What evidence from the scenario suggests the technology maturity level?'
    },
    emergingThreat: {
      id: 'emergingThreat',
      label: 'Emerging Alternative',
      description: 'Is there an emerging alternative technology that could disrupt the current approach?',
      lowLabel: 'No clear alternative',
      highLabel: 'New tech emerging',
      type: 'buttonGroup',
      hintGuidance: 'Help the student consider potential technological disruptions. Are there new technologies mentioned that could make the current approach obsolete? How mature and viable are the alternatives? What is the timeline for potential disruption?'
    }
  },
  transactionCost: {
    assetSpecificity: {
      id: 'assetSpecificity',
      label: 'Asset Specificity',
      description: 'How customized must this technology be for your specific needs?',
      lowLabel: 'Generic / Off-the-shelf',
      highLabel: 'Highly customized',
      type: 'slider',
      hintGuidance: 'Help the student think about how specialized the required investments are. Could any standard component work, or are specific specifications needed? Would investments made for this relationship be useful outside it? Consider physical, human, site, and dedicated asset specificity.'
    },
    uncertainty: {
      id: 'uncertainty',
      label: 'Environmental Uncertainty',
      description: 'How predictable is the future environment (regulatory, competitive, technological)?',
      lowLabel: 'Stable / Predictable',
      highLabel: 'Volatile / Unpredictable',
      type: 'slider',
      hintGuidance: 'Help the student assess market and technological uncertainty. How predictable are requirements over the next 3-5 years? Consider regulatory changes, competitive dynamics, and technology evolution. High uncertainty makes it harder to write complete contracts.'
    },
    frequency: {
      id: 'frequency',
      label: 'Transaction Frequency',
      description: 'How often will you need to procure/produce this component?',
      lowLabel: 'Rare / One-time',
      highLabel: 'Continuous / Daily',
      type: 'slider',
      hintGuidance: 'Help the student think about transaction volume. Is this a one-time purchase, occasional procurement, or continuous supply need? High frequency combined with high specificity often favors making in-house to amortize governance costs.'
    }
  },
  holdUpRisk: {
    switchingCosts: {
      id: 'switchingCosts',
      label: 'Switching Costs',
      description: 'How costly would it be to switch suppliers or partners once committed?',
      lowLabel: 'Easy to switch',
      highLabel: 'Very costly to switch',
      type: 'slider',
      hintGuidance: 'Help the student consider what would be lost if they needed to change partners. Are there sunk investments that cannot be recovered? Technical integration costs? Learning curve losses? Relationship-specific knowledge that would need to be rebuilt?'
    },
    relationshipSpecificity: {
      id: 'relationshipSpecificity',
      label: 'Relationship Specificity',
      description: 'How much would your partner need to invest specifically for your relationship?',
      lowLabel: 'Standard relationship',
      highLabel: 'Highly customized relationship',
      type: 'slider',
      hintGuidance: 'Help the student think about partner-specific investments. Would the supplier need to make investments that only benefit this relationship? Dedicated equipment, specialized personnel, co-located facilities? This creates mutual dependency but also potential hold-up.'
    },
    informationAsymmetry: {
      id: 'informationAsymmetry',
      label: 'Information Asymmetry',
      description: 'How much more does the potential partner know about costs and technology than you?',
      lowLabel: 'Transparent information',
      highLabel: 'Significant asymmetry',
      type: 'slider',
      hintGuidance: 'Help the student assess knowledge gaps. Does the potential partner have proprietary knowledge that makes it hard to evaluate their claims or costs? Could they exploit this information advantage in negotiations? How would you verify their representations?'
    }
  },
  bargaining: {
    supplierPower: {
      id: 'supplierPower',
      label: 'Supplier Power',
      description: 'How much leverage do potential suppliers/partners have?',
      lowLabel: 'Many alternatives',
      highLabel: 'Few dominant suppliers',
      type: 'slider',
      hintGuidance: 'Help the student assess supplier concentration and differentiation. How many qualified suppliers exist for this capability? Are they differentiated or interchangeable? Do they have other large customers, or would you be important to them?'
    },
    buyerAlternatives: {
      id: 'buyerAlternatives',
      label: 'Your Alternatives',
      description: 'How many viable alternatives do you have for sourcing this capability?',
      lowLabel: 'Few options',
      highLabel: 'Many good options',
      type: 'slider',
      hintGuidance: 'Help the student think about their negotiating leverage. Are there multiple suppliers they could realistically work with? Could they credibly threaten to make in-house or find other partners? What is their best alternative to a negotiated agreement (BATNA)?'
    },
    urgency: {
      id: 'urgency',
      label: 'Time Pressure',
      description: 'How urgent is the need to secure this capability?',
      lowLabel: 'Flexible timeline',
      highLabel: 'Urgent need',
      type: 'slider',
      hintGuidance: 'Help the student consider how time pressure affects their negotiating position. Urgency shifts power to the supplier. What is the cost of delay? Could competitors move faster? Are there market windows that could close?'
    }
  },
  additional: {
    timeHorizon: {
      id: 'timeHorizon',
      label: 'Strategic Time Horizon',
      description: 'What is your strategic planning timeframe for this decision?',
      lowLabel: 'Short-term (<2 years)',
      highLabel: 'Long-term (5+ years)',
      type: 'buttonGroup',
      hintGuidance: 'Help the student think about urgency vs. long-term strategic importance. Short horizons favor buying for speed; long horizons make building internal capabilities more valuable. What is the expected duration of need for this capability?'
    },
    capabilityGap: {
      id: 'capabilityGap',
      label: 'Capability Gap',
      description: 'How large is the gap between your current capabilities and what is needed?',
      lowLabel: 'Already capable',
      highLabel: 'Major gap to close',
      type: 'slider',
      hintGuidance: 'Help the student honestly assess internal capabilities. What skills, equipment, and resources are missing? How difficult would they be to build or acquire? How long would it take? What is the organization\'s track record building new capabilities?'
    },
    optionality: {
      id: 'optionality',
      label: 'Strategic Optionality',
      description: 'How valuable is it to maintain flexibility and multiple options?',
      lowLabel: 'Commitment is fine',
      highLabel: 'Flexibility is crucial',
      type: 'slider',
      hintGuidance: 'Help the student think about keeping options open vs. committing. What would each choice foreclose? Are there potential pivots or changes in strategy that would be harder after committing? Consider market uncertainty, technology changes, and strategic flexibility.'
    }
  }
};

// Helper to get all input IDs for a framework
export function getFrameworkInputIds(frameworkId: string): string[] {
  return Object.keys(INPUT_METADATA[frameworkId] || {});
}

// Helper to get metadata for a specific input
export function getInputMetadata(frameworkId: string, inputId: string): InputMetadata | null {
  return INPUT_METADATA[frameworkId]?.[inputId] || null;
}
