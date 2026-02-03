import { NextRequest, NextResponse } from 'next/server';
import { generateHint } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { framework, scenario, inputs } = await request.json();

    if (!framework || !scenario) {
      return NextResponse.json(
        { error: 'Framework and scenario are required' },
        { status: 400 }
      );
    }

    const hint = await generateHint(framework, scenario, inputs || {});

    return NextResponse.json({ hint });
  } catch (error) {
    console.error('Hint generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate hint. Please try again.' },
      { status: 500 }
    );
  }
}
