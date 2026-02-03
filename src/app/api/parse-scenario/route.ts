import { NextRequest, NextResponse } from 'next/server';
import { parseScenario } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { input, sourceType } = await request.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    if (input.length < 100) {
      return NextResponse.json(
        { error: 'Please provide more context (at least 100 characters)' },
        { status: 400 }
      );
    }

    const scenario = await parseScenario(input, sourceType || 'text');

    return NextResponse.json(scenario);
  } catch (error) {
    console.error('Parse scenario error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse scenario. Please try again with a different input.' },
      { status: 500 }
    );
  }
}
