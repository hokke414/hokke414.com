// Vercel Edge Function — handles POST /api/contact
// This file is separate from Astro's build and runs on Vercel's edge network.
export const config = { runtime: 'edge' };

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'リクエスト形式が不正です。' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  if (!name || !email || !message) {
    return Response.json({ error: 'すべての項目を入力してください。' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: 'メールアドレスの形式が正しくありません。' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'サーバーの設定エラーです。' }, { status: 500 });
  }

  const html = `
    <table style="font-family:sans-serif;font-size:14px;color:#1f2328;max-width:600px">
      <tr><td style="padding:8px 0"><strong>お名前:</strong> ${escape(name)}</td></tr>
      <tr><td style="padding:8px 0"><strong>メール:</strong> ${escape(email)}</td></tr>
      <tr><td style="padding:8px 0"><strong>メッセージ:</strong><br><br>
        ${escape(message).replace(/\n/g, '<br>')}
      </td></tr>
    </table>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // ドメイン hokke414.com を Resend で認証後、from を contact@hokke414.com に変更
      from: 'hokke414.com Contact <onboarding@resend.dev>',
      to: 'hokke41499@gmail.com',
      reply_to: email,
      subject: `[hokke414.com] ${name} さんからのお問い合わせ`,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error:', await res.text());
    return Response.json(
      { error: 'メールの送信に失敗しました。しばらくしてから再度お試しください。' },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
