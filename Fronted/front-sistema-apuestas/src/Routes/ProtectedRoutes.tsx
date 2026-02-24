import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  console.log(user);
  // Si no hay usuario, lo manda al login
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname,
          data: location.state,
        }}
        replace
      />
    );
  }

  // if (role && user.rol !== role) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Si pasa las validaciones, renderizamos el contenido protegido
  return <>{children}</>;
};
