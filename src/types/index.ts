// Core decision types
export type Decision = 'make' | 'buy' | 'partner';

export interface Scenario {
  id: string;
  title: string;
  summary: string;
  context: string;
  keyFactors: string[];
  stakeholders: string[];
  constraints: string[];
  rawInput?: string;
  sourceType: 'text' | 'pdf' | 'url' | 'example';
}

export interface InitialStance {
  decision: Decision;
  reasoning: string;
  confidence: number; // 1-5
  timestamp: Date;
}

// Framework types
export interface CompetitionFramework {
  performancePressure: number; // 1-5: Low to High
  costPressure: number; // 1-5: Low to High
  completed: boolean;
}

export interface TechnologyFramework {
  currentPhase: 'early' | 'mature' | 'plateau';
  emergingThreat: boolean;
  investmentLevel: number; // 1-5
  completed: boolean;
}

export interface TransactionCostFramework {
  assetSpecificity: number; // 1-5
  uncertainty: number; // 1-5
  frequency: number; // 1-5
  completed: boolean;
}

export interface HoldUpRiskFramework {
  switchingCosts: number; // 1-5
  relationshipSpecificity: number; // 1-5
  informationAsymmetry: number; // 1-5
  completed: boolean;
}

export interface BargainingFramework {
  supplierPower: number; // 1-5
  buyerAlternatives: number; // 1-5
  urgency: number; // 1-5
  completed: boolean;
}

export interface AdditionalDimensions {
  timeHorizon: 'short' | 'medium' | 'long';
  capabilityGap: number; // 1-5
  optionality: number; // 1-5
  completed: boolean;
}

export interface FrameworkResults {
  competition: CompetitionFramework;
  technology: TechnologyFramework;
  transactionCost: TransactionCostFramework;
  holdUpRisk: HoldUpRiskFramework;
  bargaining: BargainingFramework;
  additional: AdditionalDimensions;
}

// Analysis results
export interface FrameworkRecommendation {
  framework: string;
  recommendation: Decision | 'inconclusive';
  confidence: number; // 0-100
  reasoning: string;
}

export interface WeightedResult {
  make: number;
  buy: number;
  partner: number;
}

export interface FinalAnalysis {
  frameworkResults: FrameworkRecommendation[];
  weightedResult: WeightedResult;
  primaryRecommendation: Decision;
  conflictingFrameworks: boolean;
  feedback: FeedbackItem[];
}

export interface FeedbackItem {
  type: 'strength' | 'consideration' | 'flaw';
  title: string;
  description: string;
}

// Session state
export interface SessionState {
  step: AppStep;
  scenario: Scenario | null;
  initialStance: InitialStance | null;
  frameworks: FrameworkResults;
  analysis: FinalAnalysis | null;
  completedFrameworks: string[];
}

export type AppStep =
  | 'welcome'
  | 'scenario-input'
  | 'initial-stance'
  | 'frameworks'
  | 'results'
  | 'reflection';

// AI Provider types
export interface AIProvider {
  parseScenario: (input: string, sourceType: 'text' | 'pdf' | 'url') => Promise<Scenario>;
  generateHint: (framework: string, scenario: Scenario, currentInputs: Partial<FrameworkResults>) => Promise<string>;
  analyzeResults: (scenario: Scenario, stance: InitialStance, frameworks: FrameworkResults) => Promise<FinalAnalysis>;
  provideFeedback: (scenario: Scenario, stance: InitialStance, analysis: FinalAnalysis) => Promise<FeedbackItem[]>;
}

// Accessibility
export interface A11yProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
}

// Input hints types
export type FrameworkId = 'competition' | 'technology' | 'transactionCost' | 'holdUpRisk' | 'bargaining' | 'additional';

export interface InputHintState {
  hint: string | null;
  loading: boolean;
  error: string | null;
}

export type FrameworkHints = Record<string, InputHintState>;

export interface HintsState {
  competition: FrameworkHints;
  technology: FrameworkHints;
  transactionCost: FrameworkHints;
  holdUpRisk: FrameworkHints;
  bargaining: FrameworkHints;
  additional: FrameworkHints;
  generationTriggered: boolean;
}

export interface InputHintsResponse {
  framework: FrameworkId;
  hints: Record<string, string>;
}
