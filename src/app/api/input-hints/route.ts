import { NextRequest, NextResponse } from 'next/server';
import { generateInputHints } from '@/lib/ai';
import type { FrameworkId } from '@/types';

const VALID_FRAMEWORKS: FrameworkId[] = [
  'competition',
  'technology',
  'transactionCost',
  'holdUpRisk',
  'bargaining',
  'additional'
];

export async function POST(request: NextRequest) {
  try {
    const { framework, scenario } = await request.json();

    if (!framework || !scenario) {
      return NextResponse.json(
        { error: 'Framework and scenario are required' },
        { status: 400 }
      );
    }

    if (!VALID_FRAMEWORKS.includes(framework)) {
      return NextResponse.json(
        { error: `Invalid framework: ${framework}` },
        { status: 400 }
      );
    }

    const hints = await generateInputHints(framework, scenario);

    return NextResponse.json({ framework, hints });
  } catch (error) {
    console.error('Input hints generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hints. Please try again.' },
      { status: 500 }
    );
  }
}
