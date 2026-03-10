import { useEffect } from 'react';
import {
  useMemo,
  useState,
  useContext,
  createContext,
  type ReactNode,
} from 'react';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  rol: string;
  saldoReal: number;
  saldoBono: number;
}

// 👇 1. NUEVO MOLDE: Le decimos a TS exactamente qué tiene el paquete 'auth'
interface AuthState {
  token: string;
  expiracion: number;
  usuario: UserDto;
}

// Definicion de la interfaz del Contexto
interface AuthContextType {
  user: UserDto | null;
  token: string | null;
  isAutenticated: boolean;
  login: (
    token: string,
    expiracion: number,
    usuario: UserDto,
    rememberMe: boolean,
  ) => void;
  logout: () => void;
  actualizarSaldo: (nuevoSaldoReal: number, nuevoSaldoBono: number) => void;
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

  // 1️⃣ PRIMERO declaramos la función
  const actualizarSaldo = (nuevoSaldoReal: number, nuevoSaldoBono: number) => {
    setAuth((prevAuth) => {
      if (!prevAuth || !prevAuth.usuario) return prevAuth;

      const usuarioActualizado = {
        ...prevAuth.usuario,
        saldoReal: nuevoSaldoReal,
        saldoBono: nuevoSaldoBono,
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
    const refrescarDatos = async () => {
      if (!auth || !auth.token) return;

      try {
        // 🔥 RECUERDA CAMBIAR "PUERTO" POR TU PUERTO REAL (ej. localhost:5000) 🔥
        const response = await fetch('http://localhost:5127/api/auth/me', {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (response.ok) {
          const usuarioFresco = await response.json();
          console.log('DATOS FRESCOS DEL BACKEND:', usuarioFresco);
          actualizarSaldo(usuarioFresco.saldoReal, usuarioFresco.saldoBono);
        }
      } catch (error) {
        console.error('Error refrescando el saldo:', error);
      }
    };
    refrescarDatos();
  }, []); // <-- El corchete vacío asegura que solo se ejecute al dar F5

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

  const value = useMemo(
    () => ({
      user: auth ? auth.usuario : null,
      token: auth ? auth.token : null,
      isAutenticated: !!auth,
      login,
      logout,
      actualizarSaldo,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
