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
      login,
      logout,
    }),
    [auth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
