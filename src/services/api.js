const API_BASE = '/api';

export function getStoredApiKeys() {
  try {
    const data = localStorage.getItem('consensus_api_keys');
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveStoredApiKeys(keys) {
  try {
    localStorage.setItem('consensus_api_keys', JSON.stringify(keys));
  } catch (e) {
    console.error('Failed to save API keys to localStorage', e);
  }
}

export async function fetchPresets() {
  const res = await fetch(`${API_BASE}/presets`);
  if (!res.ok) throw new Error('Failed to fetch presets');
  return res.json();
}

export async function fetchPersonas() {
  const res = await fetch(`${API_BASE}/personas`);
  if (!res.ok) throw new Error('Failed to fetch personas');
  return res.json();
}

export async function fetchDebates() {
  const res = await fetch(`${API_BASE}/debates`);
  if (!res.ok) throw new Error('Failed to fetch debate history');
  return res.json();
}

export async function fetchDebate(sessionId) {
  const res = await fetch(`${API_BASE}/debates/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch debate');
  return res.json();
}

export async function deleteDebate(sessionId) {
  const res = await fetch(`${API_BASE}/debates/${sessionId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete debate');
  return res.json();
}

export async function fetchAnalytics(sessionId) {
  const res = await fetch(`${API_BASE}/analytics/${sessionId}`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function startDebate(requestData) {
  // Inject stored API keys
  const keys = getStoredApiKeys();
  const payload = {
    ...requestData,
    api_keys: { ...keys, ...(requestData.api_keys || {}) }
  };

  const res = await fetch(`${API_BASE}/debate/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to start debate');
  }

  return res.json(); // returns { session_id }
}

export function connectDebateStream(sessionId, onMessage, onError, onComplete) {
  const eventSource = new EventSource(`${API_BASE}/debate/stream/${sessionId}`);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);

      if (data.type === 'consensus_reached') {
        eventSource.close();
        if (onComplete) onComplete(data);
      } else if (data.type === 'error') {
        eventSource.close();
        if (onError) onError(new Error(data.message));
      }
    } catch (err) {
      console.error('Error parsing SSE event:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.error('SSE Error:', err);
    eventSource.close();
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}
