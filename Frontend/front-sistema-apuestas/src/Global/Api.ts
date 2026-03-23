const apiUrlFromEnv = (
  import.meta.env.VITE_API_URL as string | undefined
)?.trim();
const signalrUrlFromEnv = (
  import.meta.env.VITE_SIGNALR_URL as string | undefined
)?.trim();

export const BASE_URL = apiUrlFromEnv ? apiUrlFromEnv.replace(/\/$/, '') : '';

export const SIGNALR_URL = signalrUrlFromEnv
  ? signalrUrlFromEnv
  : `${BASE_URL}/salahub`;

type AuthTokenProvider = () => string | null;

let authTokenProvider: AuthTokenProvider | null = null;

export function setAuthTokenProvider(provider: AuthTokenProvider | null) {
  authTokenProvider = provider;
}

function getAuthHeader(): Record<string, string> {
  const token = authTokenProvider?.();
  return token ? { Authorization: `Bearer ${token}` } : {};
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
