import {
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
  saldoRecarga: number;
  mmrDota?: string;
}

// 👇 1. NUEVO MOLDE: Le decimos a TS exactamente qué tiene el paquete 'auth'
// 👇 1. NUEVO MOLDE: Le decimos a TS exactamente qué tiene el paquete 'auth'
interface AuthState {
  token: string;
  expiracion: number;
  usuario: UserDto;
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

// 👇 2. Le indicamos que esta función devuelve un AuthState
const readAuthFromStorage = (): AuthState | null => {
  try {
    let raw = localStorage.getItem('auth');
    if (!raw) {
      raw = sessionStorage.getItem('auth');
    }
    if (!raw) return null;
    const data = JSON.parse(raw);
    const expMs =
      data.expiracion < 1e12 ? data.expiracion * 1000 : data.expiracion;
    if (data && Date.now() > expMs) {
      localStorage.removeItem('auth');
      sessionStorage.removeItem('auth');
      return null;
    }
    return data as AuthState; // Confirmamos a TS que es de tipo AuthState
  } catch (e) {
    console.error('Error leyendo el auth del almacenamiento:', e);
    return null;
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState | null>(() =>
    readAuthFromStorage(),
  );

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
    // 1. Envolvemos todo en una función asíncrona interna
    const cargarCuentas = async () => {
      if (auth) {
        await fetchGameAccounts(); // Le ponemos await para que espere
      } else {
        setGameAccounts([]);
      }
    };

    // 2. La ejecutamos
    cargarCuentas();
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

      if (localStorage.getItem('auth')) {
        localStorage.setItem('auth', JSON.stringify(authActualizado));
      } else if (sessionStorage.getItem('auth')) {
        sessionStorage.setItem('auth', JSON.stringify(authActualizado));
      }

      return authActualizado;
    });
  };

  // 2️⃣ SEGUNDO ponemos el useEffect que usa la función
  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  // 3️⃣ TERCERO tus otras funciones
  const login = (
    token: string,
    expiracion: number,
    usuario: UserDto,
    rememberMe: boolean,
  ) => {
    const payload: AuthState = {
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

  const updateUserProfile = (userData: Partial<UserDto>) => {
    setAuth((prevAuth) => {
      if (!prevAuth || !prevAuth.usuario) return prevAuth;

      const authActualizado: AuthState = {
        ...prevAuth,
        usuario: {
          ...prevAuth.usuario,
          ...userData,
        },
      };

      if (localStorage.getItem('auth')) {
        localStorage.setItem('auth', JSON.stringify(authActualizado));
      } else if (sessionStorage.getItem('auth')) {
        sessionStorage.setItem('auth', JSON.stringify(authActualizado));
      }

      return authActualizado;
    });
  };

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
  }, [auth?.token]);

  const value = {
    user: auth ? auth.usuario : null,
    token: auth ? auth.token : null,
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
