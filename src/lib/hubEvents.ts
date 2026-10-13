// Activity reported to the class hub, from the browser (this app has no database).
// Reports are held in localStorage by src/lib/hub-client.ts until the hub has them, and sent with
// the hub's session cookie, so the hub records them for the signed-in student.
//
// One run per scenario (SessionState.runId, new each time a scenario is set):
//   run.started    initial instinct locked in
//   run.submitted  systematic analysis received (framework scores + AI analysis)
//   run.completed  personalised feedback received (everything above + feedback)

import { initHub, logEvent, type HubEvent } from '@/lib/hub-client';
import { DECISIONS, FRAMEWORKS } from '@/lib/constants';
import { INPUT_METADATA } from '@/lib/inputMetadata';
import type { Decision, FinalAnalysis, FrameworkResults, InitialStance, Scenario } from '@/types';

let started = false;

// Idempotent. Also sends anything still held from an earlier visit.
export function startHub(): boolean {
  if (started) return true;
  try {
    initHub({ hubUrl: process.env.NEXT_PUBLIC_HUB_URL, appSlug: process.env.NEXT_PUBLIC_HUB_APP_SLUG });
    started = true;
  } catch (err) {
    console.warn('[hub] activity reporting is off:', err instanceof Error ? err.message : err);
  }
  return started;
}

const reported = new Set<string>();

// Once per run and type (effects can run twice).
function report(event: HubEvent & { runId: string }) {
  const key = `${event.runId}:${event.type}`;
  if (reported.has(key) || !startHub()) return;
  reported.add(key);
  try {
    logEvent(event);
  } catch (err) {
    console.warn('[hub] could not report activity', err);
  }
}

const SOURCES: Record<Scenario['sourceType'], string> = {
  example: 'Example case',
  text: 'Pasted text',
  pdf: 'Uploaded file',
  url: 'Web page',
};

const PHASES = { early: 'Early (rapid progress)', mature: 'Mature (scaling up)', plateau: 'Approaching limit (plateau)' };
const HORIZONS = { short: 'Short-term (< 2 years)', medium: 'Medium-term (2-5 years)', long: 'Long-term (5+ years)' };

const label = (d: Decision | 'inconclusive') => (d === 'inconclusive' ? 'Inconclusive' : DECISIONS[d].label);
const clip = (s: string | undefined, n: number) => (s && s.length > n ? `${s.slice(0, n)}…` : s ?? '');

function rating(input: string, value: unknown): string {
  if (input === 'currentPhase') return PHASES[value as keyof typeof PHASES] ?? String(value);
  if (input === 'timeHorizon') return HORIZONS[value as keyof typeof HORIZONS] ?? String(value);
  if (input === 'emergingThreat') return value ? 'Yes, new tech emerging' : 'No clear alternative';
  return `${value} / 5`;
}

function scenarioFields(scenario: Scenario, stance: Pick<InitialStance, 'decision' | 'reasoning'>) {
  return {
    Scenario: scenario.title,
    Summary: clip(scenario.summary, 2000),
    Source: SOURCES[scenario.sourceType] ?? scenario.sourceType,
    'Key factors': scenario.keyFactors?.join('; ') ?? '',
    'Initial instinct': `${DECISIONS[stance.decision].label} (${DECISIONS[stance.decision].subtitle})`,
    'Why (initial instinct)': stance.reasoning,
  };
}

// The inputs of the frameworks the student completed, one row per factor.
function frameworkScores(frameworks: FrameworkResults, completed: string[]) {
  const rows: { Framework: string; Factor: string; Rating: string }[] = [];
  for (const id of Object.keys(FRAMEWORKS) as (keyof FrameworkResults)[]) {
    if (!completed.includes(id)) continue;
    const values = frameworks[id] as unknown as Record<string, unknown>;
    for (const [input, meta] of Object.entries(INPUT_METADATA[id] ?? {})) {
      rows.push({ Framework: FRAMEWORKS[id].title, Factor: meta.label, Rating: rating(input, values[input]) });
    }
  }
  return rows;
}

function analysisFields(analysis: FinalAnalysis, stance: Pick<InitialStance, 'decision'>) {
  const w = analysis.weightedResult;
  return {
    'Systematic recommendation': label(analysis.primaryRecommendation),
    'Matches initial instinct': analysis.primaryRecommendation === stance.decision ? 'Yes' : 'No',
    'Weighted result': `Make ${w.make}% · Buy ${w.buy}% · Partner ${w.partner}%`,
    'Frameworks split': analysis.conflictingFrameworks ? 'Yes, a judgment call' : 'No',
    'Framework recommendations': analysis.frameworkResults.map((r) => ({
      Framework: r.framework,
      Recommendation: label(r.recommendation),
      Confidence: r.recommendation === 'inconclusive' ? '—' : `${r.confidence}%`,
      Reasoning: r.reasoning,
    })),
  };
}

export function reportStanceLocked(runId: string, scenario: Scenario, stance: Pick<InitialStance, 'decision' | 'reasoning'>) {
  report({
    type: 'run.started',
    title: `Started “${scenario.title}”: instinct ${DECISIONS[stance.decision].label}`,
    runId,
    snapshot: scenarioFields(scenario, stance),
  });
}

interface RunState {
  runId: string | null;
  scenario: Scenario | null;
  initialStance: InitialStance | null;
  frameworks: FrameworkResults;
  completedFrameworks: string[];
}

export function reportAnalysis(state: RunState, analysis: FinalAnalysis) {
  const { runId, scenario, initialStance: stance } = state;
  if (!runId || !scenario || !stance) return;
  report({
    type: 'run.submitted',
    title: `Analysed “${scenario.title}”: frameworks say ${label(analysis.primaryRecommendation)} (instinct ${DECISIONS[stance.decision].label})`,
    runId,
    snapshot: {
      ...scenarioFields(scenario, stance),
      'Framework scores': frameworkScores(state.frameworks, state.completedFrameworks),
      ...analysisFields(analysis, stance),
    },
  });
}

export function reportFeedback(state: RunState, analysis: FinalAnalysis) {
  const { runId, scenario, initialStance: stance } = state;
  if (!runId || !scenario || !stance) return;
  report({
    type: 'run.completed',
    title: `Finished “${scenario.title}”: ${label(analysis.primaryRecommendation)} (instinct ${DECISIONS[stance.decision].label})`,
    runId,
    snapshot: {
      ...scenarioFields(scenario, stance),
      'Framework scores': frameworkScores(state.frameworks, state.completedFrameworks),
      ...analysisFields(analysis, stance),
      Feedback: analysis.feedback.map((f) => ({
        Type: f.type === 'strength' ? 'Strength' : f.type === 'flaw' ? 'Flaw' : 'Consideration',
        Title: f.title,
        Detail: f.description,
      })),
    },
  });
}
