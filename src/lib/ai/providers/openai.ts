import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import type { Scenario, InitialStance, FrameworkResults, FinalAnalysis, FeedbackItem } from '@/types';
import {
  SCENARIO_PARSING_PROMPT,
  HINT_GENERATION_PROMPT,
  ANALYSIS_PROMPT,
  FEEDBACK_PROMPT,
  INPUT_HINTS_PROMPT
} from '../prompts';
import { INPUT_METADATA } from '@/lib/inputMetadata';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to extract JSON from AI response (handles markdown code blocks)
function extractJSON(text: string): string {
  // Try to find JSON in markdown code blocks
  const jsonBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonBlockMatch) {
    return jsonBlockMatch[1].trim();
  }

  // Try to find JSON object or array directly
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  // Return as-is if no patterns found
  return text.trim();
}

export async function parseScenario(input: string, sourceType: 'text' | 'pdf' | 'url'): Promise<Scenario> {
  const { text } = await generateText({
    model: openai('gpt-4o'),
    system: SCENARIO_PARSING_PROMPT,
    prompt: `Source type: ${sourceType}\n\nContent:\n${input}`,
  });

  try {
    const jsonStr = extractJSON(text);
    const parsed = JSON.parse(jsonStr);
    return {
      id: `scenario-${Date.now()}`,
      ...parsed,
      rawInput: input,
      sourceType,
    };
  } catch (e) {
    console.error('Failed to parse scenario JSON:', text);
    throw new Error('Failed to parse AI response as JSON');
  }
}

export async function generateHint(
  framework: string,
  scenario: Scenario,
  currentInputs: Partial<FrameworkResults>
): Promise<string> {
  // Pass comprehensive scenario context for tailored hints
  const scenarioContext = {
    title: scenario.title,
    summary: scenario.summary,
    context: scenario.context,
    keyFactors: scenario.keyFactors,
    stakeholders: scenario.stakeholders,
    constraints: scenario.constraints,
  };

  const prompt = HINT_GENERATION_PROMPT
    .replace('{framework}', framework)
    .replace('{scenario}', JSON.stringify(scenarioContext, null, 2))
    .replace('{inputs}', JSON.stringify(currentInputs, null, 2));

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

  return text;
}

export async function analyzeResults(
  scenario: Scenario,
  stance: InitialStance,
  frameworks: FrameworkResults
): Promise<FinalAnalysis> {
  const prompt = ANALYSIS_PROMPT
    .replace('{scenario}', JSON.stringify({ title: scenario.title, summary: scenario.summary, context: scenario.context }))
    .replace('{stance}', stance.decision)
    .replace('{frameworks}', JSON.stringify(frameworks));

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

  try {
    const jsonStr = extractJSON(text);
    const analysis = JSON.parse(jsonStr);
    return {
      ...analysis,
      feedback: [],
    };
  } catch (e) {
    console.error('Failed to parse analysis JSON:', text);
    throw new Error('Failed to parse analysis response');
  }
}

export async function provideFeedback(
  scenario: Scenario,
  stance: InitialStance,
  analysis: FinalAnalysis
): Promise<FeedbackItem[]> {
  const prompt = FEEDBACK_PROMPT
    .replace('{scenario}', JSON.stringify({ title: scenario.title, summary: scenario.summary }))
    .replace('{stance}', stance.decision)
    .replace('{reasoning}', stance.reasoning)
    .replace('{analysis}', JSON.stringify({ primaryRecommendation: analysis.primaryRecommendation, weightedResult: analysis.weightedResult }));

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

  try {
    const jsonStr = extractJSON(text);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse feedback JSON:', text);
    throw new Error('Failed to parse feedback response');
  }
}

export async function generateInputHints(
  framework: string,
  scenario: Scenario
): Promise<Record<string, string>> {
  const inputsMeta = INPUT_METADATA[framework];
  if (!inputsMeta) {
    throw new Error(`Unknown framework: ${framework}`);
  }

  const inputsDescription = Object.entries(inputsMeta)
    .map(([id, meta]) => `- ${id}: "${meta.label}" - ${meta.description}\n  Guidance: ${meta.hintGuidance}`)
    .join('\n');

  const scenarioContext = {
    title: scenario.title,
    summary: scenario.summary,
    context: scenario.context,
    keyFactors: scenario.keyFactors,
  };

  const prompt = INPUT_HINTS_PROMPT
    .replace('{framework}', framework)
    .replace('{scenario}', JSON.stringify(scenarioContext, null, 2))
    .replace('{inputsMetadata}', inputsDescription);

  const { text } = await generateText({
    model: openai('gpt-4o'),
    prompt,
  });

  try {
    const jsonStr = extractJSON(text);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse input hints JSON:', text);
    throw new Error('Failed to parse input hints response');
  }
}
