export const BASE_URL = 'http://localhost:5127';

// Obtiene el token del almacenamiento (guardado dentro del objeto "auth")
function getAuthHeader(): Record<string, string> {
  let raw = localStorage.getItem('auth');
  if (!raw) {
    raw = sessionStorage.getItem('auth');
  }
  if (!raw) return {};
  try {
    const data = JSON.parse(raw);
    return data?.token ? { Authorization: `Bearer ${data.token}` } : {};
  } catch {
    return {};
  }
}

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };
  console.log(getAuthHeader());
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${txt}`);
  }

  return res.status !== 204 ? res.json().catch(() => null) : null;
}
