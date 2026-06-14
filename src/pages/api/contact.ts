// This route exists as a local dev fallback only.
// On Vercel, POST requests are handled by /api/contact.js (root-level Edge function).
export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({ error: 'POST only. Deploy to Vercel to use this endpoint.' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } },
  );
}
