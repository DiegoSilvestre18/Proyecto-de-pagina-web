import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  type ReactNode,
} from 'react';
import { apiFetch } from '../Global/Api';

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
  isAutenticated: boolean;
  gameAccounts: GameAccount[];
  hasGameAccount: (juego: string) => boolean;
  fetchGameAccounts: () => Promise<void>;
  updateBalance: (saldoReal: number, saldoBono: number) => void;
  login: (
    token: string,
    expiracion: number,
    usuario: UserDto,
    rememberMe: boolean,
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para consumir el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthContextProvider');
  }
  return context;
};

// Función auxiliar
const readAuthFromStorage = () => {
  try {
    // Se lee de localStorage primero, si no existe se lee de sessionStorage
    let raw = localStorage.getItem('auth');
    if (!raw) {
      raw = sessionStorage.getItem('auth');
    }
    if (!raw) return null;
    // Se parsea el JSON y se verifica la expiración
    const data = JSON.parse(raw);
    // Comparar correctamente: si expiracion es en segundos (Unix/JWT), convertir a ms
    const expMs =
      data.expiracion < 1e12 ? data.expiracion * 1000 : data.expiracion;
    if (data && Date.now() > expMs) {
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
      return null;
    }
    return data;
  } catch (e) {
    console.error('Error leyendo el auth del almacenamiento:', e);
    return null;
  }
};

// Se saca el Provider FUERA de la función readAuthFromStorage children
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState(() => readAuthFromStorage());
  const [gameAccounts, setGameAccounts] = useState<GameAccount[]>([]);

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
    if (auth) {
      fetchGameAccounts();
    } else {
      setGameAccounts([]);
    }
  }, [auth, fetchGameAccounts]);

  const updateBalance = (saldoReal: number, saldoBono: number) => {
    if (!auth) return;
    const updated = {
      ...auth,
      usuario: { ...auth.usuario, saldoReal, saldoBono },
    };
    // Persistir en el storage correspondiente
    if (localStorage.getItem('auth')) {
      localStorage.setItem('auth', JSON.stringify(updated));
    } else {
      sessionStorage.setItem('auth', JSON.stringify(updated));
    }
    setAuth(updated);
  };

  const login = (
    token: string,
    expiracion: number, // Sugiero usar número (timestamp) para comparar fácilmente con Date.now()
    usuario: UserDto,
    rememberMe: boolean,
  ) => {
    const payload = {
      token,
      expiracion,
      usuario,
    };
    if (rememberMe) {
      localStorage.setItem('auth', JSON.stringify(payload));
    } else {
      sessionStorage.setItem('auth', JSON.stringify(payload));
    }
    setAuth(payload);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
    setAuth(null);
  };

  // auth al array de dependencias
  const value = useMemo(
    () => ({
      user: auth ? auth.usuario : null,
      token: auth ? auth.token : null,
      isAutenticated: !!auth,
      gameAccounts,
      hasGameAccount,
      fetchGameAccounts,
      updateBalance,
      login,
      logout,
    }),
    [auth, gameAccounts, hasGameAccount, fetchGameAccounts],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
