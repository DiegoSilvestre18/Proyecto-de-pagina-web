import { Routes, Route } from 'react-router-dom';
import Layout from '../Components/layout/Layout';
import Home from '../Components/Features/Home';
import Login from '../Components/Features/Login/Pages/Login';
import Register from '../Components/Features/Register/Pages/Register';
import MainPage from '../Components/Features/Main/Pages/MainPage';
// import MainAdmin from '../Components/Features/MainAdmin/Pages/MainAdmin';
import SolicitudRecarga from '../Components/Features/SolicitudDinero/pages/SolicitudRecarga';
import { ProtectedRoute } from './ProtectedRoutes';

export const ClienteRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/solicitud-recarga"
        element={
          <ProtectedRoute>
            <SolicitudRecarga />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
