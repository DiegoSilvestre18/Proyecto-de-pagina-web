import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) {
    return null;
  }

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

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.rol.toUpperCase())
  ) {
    return <Navigate to="/main" replace />;
  }

  // Si pasa las validaciones, renderizamos el contenido protegido
  return <>{children}</>;
};
