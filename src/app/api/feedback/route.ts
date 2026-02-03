import { NextRequest, NextResponse } from 'next/server';
import { provideFeedback } from '@/lib/ai';
import type { FeedbackItem, Decision } from '@/types';

// Fallback feedback when AI is not available
function generateLocalFeedback(
  stanceDecision: Decision,
  stanceReasoning: string,
  analysisRecommendation: Decision
): FeedbackItem[] {
  const feedback: FeedbackItem[] = [];
  const matched = stanceDecision === analysisRecommendation;

  // Always add at least one strength
  if (matched) {
    feedback.push({
      type: 'strength',
      title: 'Your instinct aligned with systematic analysis',
      description: `Your initial choice of ${stanceDecision.toUpperCase()} was validated by the frameworks. This suggests you intuitively recognized key factors that drive this decision.`,
    });
  } else {
    feedback.push({
      type: 'strength',
      title: 'You engaged thoughtfully with the problem',
      description: `Your reasoning shows careful consideration of the strategic context. The frameworks revealed additional factors that shifted the recommendation.`,
    });
  }

  // Add considerations based on the analysis
  feedback.push({
    type: 'consideration',
    title: 'What the frameworks revealed',
    description: matched
      ? `Multiple frameworks pointed toward ${analysisRecommendation.toUpperCase()}, reinforcing your initial thinking. The systematic analysis confirmed factors like transaction costs and hold-up risk.`
      : `The frameworks highlighted factors you may have weighted differently. Consider how transaction costs, technology lifecycle, and bargaining position influenced the recommendation toward ${analysisRecommendation.toUpperCase()}.`,
  });

  // Add a learning point
  feedback.push({
    type: 'consideration',
    title: 'Key learning',
    description: 'Systematic frameworks help surface blind spots and validate intuitions. Over time, this process builds strategic pattern recognition.',
  });

  return feedback;
}

export async function POST(request: NextRequest) {
  try {
    const { scenario, stance, analysis } = await request.json();

    if (!scenario || !stance || !analysis) {
      return NextResponse.json(
        { error: 'Scenario, stance, and analysis are required' },
        { status: 400 }
      );
    }

    // Try AI feedback first
    try {
      const feedback = await provideFeedback(scenario, stance, analysis);
      return NextResponse.json(feedback);
    } catch (aiError) {
      console.warn('AI feedback failed, using local generation:', aiError);
      // Fallback to local feedback
      const localFeedback = generateLocalFeedback(
        stance.decision,
        stance.reasoning,
        analysis.primaryRecommendation
      );
      return NextResponse.json(localFeedback);
    }
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback.' },
      { status: 500 }
    );
  }
}
