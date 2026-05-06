const N8N_URL = (): string => {
  const u = import.meta.env.N8N_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;
  if (!u) throw new Error('N8N_WEBHOOK_URL not set');
  return u;
};

const N8N_AUTH = (): string => {
  const a = import.meta.env.N8N_WEBHOOK_AUTH || process.env.N8N_WEBHOOK_AUTH || '';
  return a;
};

export async function postToN8n(path: string, body: unknown): Promise<Response> {
  const url = `${N8N_URL().replace(/\/$/, '')}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const auth = N8N_AUTH();
  if (auth) headers['Authorization'] = `Bearer ${auth}`;

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`n8n ${path} failed`, res.status, text);
  }
  return res;
}
