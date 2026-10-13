// fetch() for this app's API routes. They need the class hub's session cookie; when it has
// expired (401), reload so the page's sign-in check sends the browser through the hub and back.
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const res = await fetch(input, init);
  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.reload();
    return new Promise<Response>(() => {});
  }
  return res;
}
