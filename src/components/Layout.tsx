import React from 'react';
import { Role, AppView } from '../types'; // Importa AppView
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;

  activeSede: string;
  onSedeSelect: (sede: string) => void;
  onLogout: () => void;
  // NUEVAS PROPS:
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  availableSedes?: string[]; // <-- NUEVO
  // Deprecated/Optional compatibility props (if needed by other parents, though App.tsx is updated)
  onRoleSelect?: (role: Role) => void;
  onHome?: () => void;
  activeTab?: any;
  onTabChange?: (tab: any) => void;
  // BÚSQUEDA GLOBAL
  searchData?: { alumnos: any[], docentes: any[] };
}

const Layout: React.FC<LayoutProps> = ({
  children, activeSede, onSedeSelect, onLogout,
  currentView, onNavigate, searchData, availableSedes // <-- Desestructuramos availableSedes
}) => {

  // Función auxiliar para las clases de los botones del menú
  const getMenuButtonClass = (view: AppView) => {
    // Fallback safe in case currentView is undefined initially (though strict typed)
    const isActive = currentView === view;
    return `w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${isActive
      ? 'bg-black text-white shadow-lg shadow-black/20'
      : 'text-zinc-600 hover:bg-zinc-50 hover:text-black'
      }`;
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans pb-20 md:pb-0">
      {/* SIDEBAR: Hidden on mobile, Flex on desktop */}
      <aside className="w-64 hidden md:flex flex-col fixed h-full bg-white border-r border-zinc-200 z-40 justify-between">
        <div>
          {/* Logo... */}
          <div className="h-20 flex items-center px-8 border-b border-zinc-100">
            <h2 className="text-2xl font-black italic tracking-tighter">NX<span className="text-green-500">.</span></h2>
          </div>

          {/* NAVEGACIÓN DESKTOP */}
          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className={getMenuButtonClass('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('teachers')}
              className={getMenuButtonClass('teachers')}
            >
              <Users size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Docentes</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className={getMenuButtonClass('settings')}
            >
              <Settings size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Ajustes</span>
            </button>
          </nav>
        </div>

        {/* Botón Salir... */}
        <div className="p-4 border-t border-zinc-100">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Salir</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL responsive */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar activeSede={activeSede} onSedeSelect={onSedeSelect} searchData={searchData} availableSedes={availableSedes} />
        <div className="p-4 md:p-10 flex-1 overflow-auto bg-zinc-50/50">
          {children}
        </div>
        <Footer />
      </main>

      {/* MENÚ MÓVIL (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-2 flex justify-around z-50 pb-safe">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center p-3 rounded-xl transition-colors ${currentView === 'dashboard' ? 'text-black' : 'text-zinc-600'}`}
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold uppercase mt-1">Inicio</span>
        </button>
        <button
          onClick={() => onNavigate('teachers')}
          className={`flex flex-col items-center p-3 rounded-xl transition-colors ${currentView === 'teachers' ? 'text-black' : 'text-zinc-600'}`}
        >
          <Users size={24} />
          <span className="text-[10px] font-bold uppercase mt-1">Docentes</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`flex flex-col items-center p-3 rounded-xl transition-colors ${currentView === 'settings' ? 'text-black' : 'text-zinc-600'}`}
        >
          <Settings size={24} />
          <span className="text-[10px] font-bold uppercase mt-1">Ajustes</span>
        </button>
        <button
          onClick={onLogout}
          className="flex flex-col items-center p-3 rounded-xl text-red-500"
        >
          <LogOut size={24} />
          <span className="text-[10px] font-bold uppercase mt-1">Salir</span>
        </button>
      </div>

    </div>
  );
};

export default Layout;