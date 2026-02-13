import React from 'react';
import { Role, AppView } from '../types'; // Importa AppView
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: Role | null;
  activeSede: string;
  onSedeSelect: (sede: string) => void;
  onLogout: () => void;
  // NUEVAS PROPS:
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  // Deprecated/Optional compatibility props (if needed by other parents, though App.tsx is updated)
  onRoleSelect?: (role: Role) => void;
  onHome?: () => void;
  activeTab?: any;
  onTabChange?: (tab: any) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children, activeRole, activeSede, onSedeSelect, onLogout,
  currentView, onNavigate // Desestructuramos las nuevas props
}) => {

  // Función auxiliar para las clases de los botones del menú
  const getMenuButtonClass = (view: AppView) => {
    // Fallback safe in case currentView is undefined initially (though strict typed)
    const isActive = currentView === view;
    return `w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${isActive
        ? 'bg-black text-white shadow-lg shadow-black/20'
        : 'text-zinc-400 hover:bg-zinc-50 hover:text-black'
      }`;
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-20 md:w-64 bg-white border-r border-zinc-200 fixed h-full z-40 flex flex-col justify-between">
        <div>
          {/* Logo... */}
          <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-zinc-100">
            <h2 className="text-2xl font-black italic tracking-tighter">NX<span className="text-green-500 md:inline hidden">.</span></h2>
          </div>

          {/* NAVEGACIÓN ACTIVADA */}
          <nav className="p-4 space-y-2 mt-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className={getMenuButtonClass('dashboard')}
            >
              <LayoutDashboard size={20} />
              <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('teachers')}
              className={getMenuButtonClass('teachers')}
            >
              <Users size={20} />
              <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Docentes</span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className={getMenuButtonClass('settings')}
            >
              <Settings size={20} />
              <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Ajustes</span>
            </button>
          </nav>
        </div>

        {/* Botón Salir... */}
        <div className="p-4 border-t border-zinc-100">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Salir</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-20 md:ml-64 flex flex-col min-h-screen">
        <Navbar activeSede={activeSede} onSedeSelect={onSedeSelect} />
        <div className="p-6 md:p-10 flex-1 overflow-auto bg-zinc-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;