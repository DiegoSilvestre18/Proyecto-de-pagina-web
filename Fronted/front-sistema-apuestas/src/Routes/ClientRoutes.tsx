import { Routes, Route } from 'react-router-dom';
import Layout from '../Components/layout/Layout';
import AppLayout from '../Components/layout/AppLayout';
import Home from '../Components/Features/Home';
import Login from '../Components/Features/Login/Pages/Login';
import Register from '../Components/Features/Register/Pages/Register';
import Dashboard from '../Components/Features/Main/Pages/Dashboard';
import MainAdmin from '../Components/Features/MainAdmin/Pages/MainAdmin';
import AccountSettings from '../Components/Features/Settings/Pages/AccountSettings';
import IntegrationsSettings from '../Components/Features/Settings/Pages/IntegrationsSettings';
import Salas from '../Components/Features/Salas/Salas';
import SolicitudRecarga from '../Components/Features/SolicitudDinero/pages/SolicitudRecarga';
import { ProtectedRoute } from './ProtectedRoutes';
import {
  mockClubs,
  mockSalas,
  filtrosModos,
} from '../Components/Features/Main/Data/mockData';
import SettingsLayout from '../Components/layout/SettingsLayout';
import SolicitudRetiro from '../Components/Features/SolicitudDinero/pages/SolicitudRetiro';

export const ClienteRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rutas protegidas con el layout principal (Sidebar + Header) */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/main" element={<Dashboard clubs={mockClubs} />} />
        <Route
          path="/main/salas"
          element={<Salas salas={mockSalas} filtrosModos={filtrosModos} />}
        />
        <Route path="/main/recarga" element={<SolicitudRecarga />} />
        <Route path="/main/retiro" element={<SolicitudRetiro />} />
        <Route
          element={
            <ProtectedRoute>
              <SettingsLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/main/settings/cuenta" element={<AccountSettings />} />
          <Route
            path="/main/settings/integraciones"
            element={<IntegrationsSettings />}
          />
        </Route>
      </Route>

      <Route
        path="/main-admin"
        element={
          <ProtectedRoute>
            <MainAdmin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
