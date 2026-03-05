import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import Sidebar from '../Common/Sidebar';
import Header from '../Common/Header';

/**
 * Layout principal para páginas autenticadas.
 * Contiene el Sidebar + Header y renderiza la vista central con <Outlet />.
 */
const AppLayout: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-[#0b0c1b] text-white font-sans overflow-hidden">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <Header
          user={user}
          showBalance={showBalance}
          onToggleBalance={() => setShowBalance(!showBalance)}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateRecarga={() => navigate('/main/recarga')}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <Outlet />
        </div>
      </main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0b0c1b; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2b3d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ea580c; }

        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-right-8 { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-in { animation-fill-mode: both; }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-right-8 { animation-name: slide-in-from-right-8; }
        .duration-500 { animation-duration: 500ms; }
      `,
        }}
      />
    </div>
  );
};

export default AppLayout;
