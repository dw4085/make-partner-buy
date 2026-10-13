import { NextRequest, NextResponse } from 'next/server';
import { denyUnlessSignedIn } from '@/lib/auth';
import { generateHint } from '@/lib/ai';

export async function POST(request: NextRequest) {
  const denied = await denyUnlessSignedIn();
  if (denied) return denied;

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
