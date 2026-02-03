import type { Scenario, InitialStance, FrameworkResults, FinalAnalysis, FeedbackItem } from '@/types';
import * as anthropicProvider from './providers/anthropic';
import * as openaiProvider from './providers/openai';

// Determine which provider to use based on environment variable
// Set AI_PROVIDER=openai to use OpenAI, defaults to Anthropic
const getProvider = () => {
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  if (provider === 'openai') {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required when using OpenAI provider');
    }
    return openaiProvider;
  }

  // Default to Anthropic
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is required when using Anthropic provider');
  }
  return anthropicProvider;
};

export async function parseScenario(
  input: string,
  sourceType: 'text' | 'pdf' | 'url'
): Promise<Scenario> {
  const provider = getProvider();
  return provider.parseScenario(input, sourceType);
}

export async function generateHint(
  framework: string,
  scenario: Scenario,
  currentInputs: Partial<FrameworkResults>
): Promise<string> {
  const provider = getProvider();
  return provider.generateHint(framework, scenario, currentInputs);
}

export async function analyzeResults(
  scenario: Scenario,
  stance: InitialStance,
  frameworks: FrameworkResults
): Promise<FinalAnalysis> {
  const provider = getProvider();
  return provider.analyzeResults(scenario, stance, frameworks);
}

export async function provideFeedback(
  scenario: Scenario,
  stance: InitialStance,
  analysis: FinalAnalysis
): Promise<FeedbackItem[]> {
  const provider = getProvider();
  return provider.provideFeedback(scenario, stance, analysis);
}

export async function generateInputHints(
  framework: string,
  scenario: Scenario
): Promise<Record<string, string>> {
  const provider = getProvider();
  return provider.generateInputHints(framework, scenario);
}

// Re-export the example scenario
export { RIVIAN_EXAMPLE_SCENARIO } from './prompts';
