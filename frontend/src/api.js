const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchResources(params = {}) {
  const query = new URLSearchParams();
  if (params.q) query.append('q', params.q);
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.platform && params.platform !== 'all') query.append('platform', params.platform);
  if (params.pricing_type && params.pricing_type !== 'all') query.append('pricing_type', params.pricing_type);

  const qs = query.toString();
  const url = qs ? `${BASE_URL}/resources?${qs}` : `${BASE_URL}/resources`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch resources');
  return res.json();
}

export async function fetchGuides() {
  const res = await fetch(`${BASE_URL}/guides`);
  if (!res.ok) throw new Error('Failed to fetch guides');
  return res.json();
}

export async function sendChatMessage(message, history = [], preferredPlatform = null) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history,
      preferred_platform: preferredPlatform
    })
  });
  if (!res.ok) throw new Error('Failed to get chat advice');
  return res.json();
}

export async function submitStudentFeedback(payload) {
  const res = await fetch(`${BASE_URL}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
}
