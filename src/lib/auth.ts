import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { canUseThisApp, hubCookieName, verifyHubToken, type HubUser } from '@/lib/hub';

// The signed-in person, from the class hub's session cookie (one sign-in for every class app).
export async function getHubUser(): Promise<HubUser | null> {
  return verifyHubToken((await cookies()).get(hubCookieName())?.value);
}

// For API routes (all of them call an AI model or fetch content for a student): a 401/403
// response to return when the request has no valid class session, otherwise null.
export async function denyUnlessSignedIn(): Promise<NextResponse | null> {
  const user = await getHubUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (!canUseThisApp(user)) return NextResponse.json({ error: 'This activity is not open to you' }, { status: 403 });
  return null;
}
