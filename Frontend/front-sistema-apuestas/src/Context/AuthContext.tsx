import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  type ReactNode,
} from 'react';
import { apiFetch, setAuthTokenProvider } from '../Global/Api';

const AUTH_STORAGE_KEY = 'auth';
const AUTH_SCHEMA_VERSION = 2;

type StorageScope = 'local' | 'session';

export interface UserDto {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  username: string;
  email: string;
  rol: string;
  saldoReal: number;
  saldoBono: number;
  saldoRecarga: number;
  mmrDota?: string;
}

interface AuthState {
  token: string;
  expiracion: number;
  usuario: UserDto;
}

type PersistedUser = Pick<
  UserDto,
  'id' | 'username' | 'rol' | 'saldoReal' | 'saldoBono' | 'saldoRecarga' | 'mmrDota'
>;

interface PersistedAuthState {
  v: number;
  token: string;
  expiracion: number;
  usuario: PersistedUser;
}

interface LoadedAuthState {
  auth: AuthState | null;
  scope: StorageScope | null;
}

export interface GameAccount {
  id: number;
  idVisible: string;
  idExterno: string;
  juego: string;
  rangoActual: string;
}

// Definicion de la interfaz del Contexto
interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAuthReady: boolean;
  isAutenticated: boolean;
  gameAccounts: GameAccount[];
  hasGameAccount: (juego: string) => boolean;
  fetchGameAccounts: () => Promise<void>;
  updateBalance: (saldoReal: number, saldoBono: number) => void;
  login: (
    token: string,
    expiracion: number | string | Date,
    usuario: UserDto,
    rememberMe: boolean,
  ) => void;
  logout: () => void;
  actualizarSaldo: (
    nuevoSaldoReal: number,
    nuevoSaldoBono: number,
    nuevoSaldoRecarga: number,
  ) => void;
  updateUserProfile: (userData: Partial<UserDto>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthContextProvider');
  }
  return context;
};

const getStorage = (scope: StorageScope) =>
  scope === 'local' ? localStorage : sessionStorage;

const getPersistedUser = (usuario: UserDto): PersistedUser => ({
  id: usuario.id,
  username: usuario.username,
  rol: usuario.rol,
  saldoReal: usuario.saldoReal,
  saldoBono: usuario.saldoBono,
  saldoRecarga: usuario.saldoRecarga,
  mmrDota: usuario.mmrDota,
});

const toAuthState = (token: string, expiracion: number, usuario: PersistedUser) => ({
  token,
  expiracion,
  usuario: {
    id: usuario.id,
    username: usuario.username,
    rol: usuario.rol,
    saldoReal: usuario.saldoReal,
    saldoBono: usuario.saldoBono,
    saldoRecarga: usuario.saldoRecarga,
    mmrDota: usuario.mmrDota,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    email: '',
  },
});

const toPersistedAuth = (auth: AuthState): PersistedAuthState => ({
  v: AUTH_SCHEMA_VERSION,
  token: auth.token,
  expiracion: auth.expiracion,
  usuario: getPersistedUser(auth.usuario),
});

const decodeJwtExpMs = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');

    const decoded = atob(normalizedPayload);
    const data = JSON.parse(decoded) as { exp?: unknown };

    if (typeof data.exp !== 'number' || !Number.isFinite(data.exp)) {
      return null;
    }

    return data.exp * 1000;
  } catch {
    return null;
  }
};

const normalizeExpiracionMs = (
  expiracion: unknown,
  token?: string,
): number | null => {
  if (typeof expiracion === 'number' && Number.isFinite(expiracion)) {
    return expiracion < 1e12 ? expiracion * 1000 : expiracion;
  }

  if (typeof expiracion === 'string') {
    const normalizedValue = expiracion.trim();
    if (!normalizedValue) {
      return token ? decodeJwtExpMs(token) : null;
    }

    const asNumber = Number(normalizedValue);
    if (Number.isFinite(asNumber)) {
      return asNumber < 1e12 ? asNumber * 1000 : asNumber;
    }

    const parsedDate = Date.parse(normalizedValue);
    if (!Number.isNaN(parsedDate)) {
      return parsedDate;
    }

    return token ? decodeJwtExpMs(token) : null;
  }

  if (expiracion instanceof Date && !Number.isNaN(expiracion.getTime())) {
    return expiracion.getTime();
  }

  return token ? decodeJwtExpMs(token) : null;
};

const normalizeAuthPayload = (data: unknown): AuthState | null => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const payload = data as {
    v?: unknown;
    token?: unknown;
    expiracion?: unknown;
    usuario?: Partial<UserDto>;
  };

  if (typeof payload.token !== 'string') {
    return null;
  }

  const expiracionMs = normalizeExpiracionMs(payload.expiracion, payload.token);
  if (!expiracionMs) {
    return null;
  }

  if (!payload.usuario || typeof payload.usuario !== 'object') {
    return null;
  }

  const usuario = payload.usuario;
  if (
    typeof usuario.id !== 'number' ||
    typeof usuario.username !== 'string' ||
    typeof usuario.rol !== 'string'
  ) {
    return null;
  }

  const saldoReal = Number(usuario.saldoReal ?? 0);
  const saldoBono = Number(usuario.saldoBono ?? 0);
  const saldoRecarga = Number(usuario.saldoRecarga ?? 0);

  if (Number.isNaN(saldoReal) || Number.isNaN(saldoBono) || Number.isNaN(saldoRecarga)) {
    return null;
  }

  if (payload.v === AUTH_SCHEMA_VERSION) {
    return toAuthState(payload.token, expiracionMs, {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      saldoReal,
      saldoBono,
      saldoRecarga,
      mmrDota: typeof usuario.mmrDota === 'string' ? usuario.mmrDota : undefined,
    });
  }

  return {
    token: payload.token,
    expiracion: expiracionMs,
    usuario: {
      id: usuario.id,
      username: usuario.username,
      rol: usuario.rol,
      saldoReal,
      saldoBono,
      saldoRecarga,
      mmrDota: typeof usuario.mmrDota === 'string' ? usuario.mmrDota : undefined,
      nombre: typeof usuario.nombre === 'string' ? usuario.nombre : '',
      apellidoPaterno:
        typeof usuario.apellidoPaterno === 'string' ? usuario.apellidoPaterno : '',
      apellidoMaterno:
        typeof usuario.apellidoMaterno === 'string' ? usuario.apellidoMaterno : '',
      telefono: typeof usuario.telefono === 'string' ? usuario.telefono : '',
      email: typeof usuario.email === 'string' ? usuario.email : '',
    },
  };
};

const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
};

const clearAuthStorageByScope = (scope: StorageScope) => {
  getStorage(scope).removeItem(AUTH_STORAGE_KEY);
};

const readAuthFromStorage = (): LoadedAuthState => {
  const readCandidate = (scope: StorageScope): AuthState | null => {
    try {
      const raw = getStorage(scope).getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      const data = normalizeAuthPayload(parsed);

      if (!data || Date.now() > data.expiracion) {
        clearAuthStorageByScope(scope);
        return null;
      }

      return data;
    } catch (e) {
      console.error(`Error leyendo auth en ${scope}Storage:`, e);
      clearAuthStorageByScope(scope);
      return null;
    }
  };

  const sessionAuth = readCandidate('session');
  const localAuth = readCandidate('local');

  if (sessionAuth) {
    if (localAuth) {
      clearAuthStorageByScope('local');
    }
    return { auth: sessionAuth, scope: 'session' };
  }

  if (localAuth) {
    return { auth: localAuth, scope: 'local' };
  }

  return { auth: null, scope: null };
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [storageScope, setStorageScope] = useState<StorageScope | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [gameAccounts, setGameAccounts] = useState<GameAccount[]>([]);

  const persistAuth = useCallback(
    (nextAuth: AuthState | null, nextScope = storageScope) => {
      if (!nextAuth || !nextScope) {
        clearAuthStorage();
        return;
      }

      const serialized = JSON.stringify(toPersistedAuth(nextAuth));
      const storage = getStorage(nextScope);
      storage.setItem(AUTH_STORAGE_KEY, serialized);
      const oppositeStorage = getStorage(
        nextScope === 'local' ? 'session' : 'local',
      );
      oppositeStorage.removeItem(AUTH_STORAGE_KEY);
    },
    [storageScope],
  );

  useEffect(() => {
    const loaded = readAuthFromStorage();
    setAuth(loaded.auth);
    setStorageScope(loaded.scope);
    setIsAuthReady(true);
  }, []);

  useEffect(() => {
    setAuthTokenProvider(() => auth?.token ?? null);
  }, [auth?.token]);

  useEffect(() => {
    return () => {
      setAuthTokenProvider(null);
    };
  }, []);

  const fetchGameAccounts = useCallback(async () => {
    try {
      const data = await apiFetch('/api/GameAccount/mis-cuentas');
      if (Array.isArray(data)) {
        setGameAccounts(data);
      } else if (data && Array.isArray(data.response)) {
        setGameAccounts(data.response);
      } else {
        setGameAccounts([]);
      }
    } catch (error) {
      console.error('Error al obtener cuentas de juego:', error);
      setGameAccounts([]);
    }
  }, []);

  const hasGameAccount = useCallback(
    (juego: string) => {
      const normalize = (s: string) => s.toUpperCase().replace(/\d+$/, '');
      return gameAccounts.some(
        (acc) => normalize(acc.juego) === normalize(juego),
      );
    },
    [gameAccounts],
  );

  // Cargar cuentas de juego cuando hay sesión activa
  useEffect(() => {
    const cargarCuentas = async () => {
      if (auth?.token) {
        await fetchGameAccounts();
      } else {
        setGameAccounts([]);
      }
    };

    void cargarCuentas();
  }, [auth?.token, fetchGameAccounts]);

  const updateBalance = (saldoReal: number, saldoBono: number) => {
    if (!auth) return;
    const updated = {
      ...auth,
      usuario: { ...auth.usuario, saldoReal, saldoBono },
    };
    persistAuth(updated);
    setAuth(updated);
  };

  // 1️⃣ PRIMERO declaramos la función
  const actualizarSaldo = (
    nuevoSaldoReal: number,
    nuevoSaldoBono: number,
    nuevoSaldoRecarga: number,
  ) => {
    // 👈 Agrega el tercer parámetro
    setAuth((prevAuth) => {
      if (!prevAuth || !prevAuth.usuario) return prevAuth;

      const usuarioActualizado = {
        ...prevAuth.usuario,
        saldoReal: nuevoSaldoReal,
        saldoBono: nuevoSaldoBono,
        saldoRecarga: nuevoSaldoRecarga, // 👈 Guárdalo aquí
      };

      const authActualizado: AuthState = {
        ...prevAuth,
        usuario: usuarioActualizado,
      };

      persistAuth(authActualizado);

      return authActualizado;
    });
  };

  // 2️⃣ SEGUNDO tus otras funciones
  const login = (
    token: string,
    expiracion: number | string | Date,
    usuario: UserDto,
    rememberMe: boolean,
  ) => {
    const expiracionMs = normalizeExpiracionMs(expiracion, token);
    if (!expiracionMs) {
      throw new Error('No se pudo determinar la expiracion del token.');
    }

    const payload: AuthState = {
      token,
      expiracion: expiracionMs,
      usuario,
    };
    const nextScope: StorageScope = rememberMe ? 'local' : 'session';
    setStorageScope(nextScope);
    persistAuth(payload, nextScope);
    setAuth(payload);
  };

  const logout = () => {
    clearAuthStorage();
    setStorageScope(null);
    setAuth(null);
  };

  const updateUserProfile = useCallback((userData: Partial<UserDto>) => {
    setAuth((prevAuth) => {
      if (!prevAuth || !prevAuth.usuario) return prevAuth;

      const hasChanges = Object.entries(userData).some(([key, value]) => {
        const typedKey = key as keyof UserDto;
        return prevAuth.usuario[typedKey] !== value;
      });

      if (!hasChanges) {
        return prevAuth;
      }

      const authActualizado: AuthState = {
        ...prevAuth,
        usuario: {
          ...prevAuth.usuario,
          ...userData,
        },
      };

      persistAuth(authActualizado);

      return authActualizado;
    });
  }, [persistAuth]);

  const refreshProfile = useCallback(async () => {
    if (!auth?.token) return;

    try {
      const usuarioFresco = await apiFetch('/api/auth/me');
      if (!usuarioFresco) return;

      updateUserProfile({
        id: usuarioFresco.id,
        username: usuarioFresco.username,
        nombre: usuarioFresco.nombre,
        apellidoPaterno: usuarioFresco.apellidoPaterno,
        apellidoMaterno: usuarioFresco.apellidoMaterno,
        telefono: usuarioFresco.telefono,
        email: usuarioFresco.email,
        rol: usuarioFresco.rol,
        saldoReal: usuarioFresco.saldoReal,
        saldoBono: usuarioFresco.saldoBono,
        saldoRecarga: usuarioFresco.saldoRecarga,
        mmrDota: usuarioFresco.mmrDota,
      });
    } catch (error) {
      console.error('Error refrescando el perfil:', error);
    }
  }, [auth?.token, updateUserProfile]);

  // 3️⃣ TERCERO ponemos el useEffect que usa la función
  useEffect(() => {
    // Solo refrescamos si hay un token válido, y dependemos del token, NO de la función
    if (auth?.token) {
      void refreshProfile();
    }
  }, [auth?.token]); // 👈 Ahora solo se dispara 1 vez cuando el usuario inicia sesión

  const value = {
    user: auth ? auth.usuario : null,
    token: auth ? auth.token : null,
    isAuthReady,
    isAutenticated: !!auth,
    gameAccounts,
    hasGameAccount,
    fetchGameAccounts,
    updateBalance,
    login,
    logout,
    actualizarSaldo,
    updateUserProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
