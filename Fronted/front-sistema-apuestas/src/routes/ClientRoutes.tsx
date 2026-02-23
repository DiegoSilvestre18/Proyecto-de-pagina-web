import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../components/features/Home';
import Login from '../components/features/Login/Pages/Login';
import Register from '../components/features/Register/Pages/Register';

export const ClienteRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
};
