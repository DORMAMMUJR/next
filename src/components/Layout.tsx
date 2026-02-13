import React from 'react';
import { Role } from '../types';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';
import Navbar from './Navbar'; // <--- IMPORTANTE

interface LayoutProps {
  children: React.ReactNode;
  activeRole: Role | null;
  activeSede: string;
  onSedeSelect: (sede: string) => void;
  onLogout: () => void;
  // --- NEW: Navigation Props ---
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  // Others kept for compatibility if needed
  onRoleSelect?: (role: Role) => void;
  onHome?: () => void;
  onSedes?: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children, activeRole, activeSede, onSedeSelect, onLogout,
  activeTab = 'dashboard', onTabChange
}) => {

  const NavButton = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => onTabChange && onTabChange(id)}
        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${isActive
            ? 'bg-black text-white shadow-lg shadow-black/20'
            : 'text-zinc-400 hover:bg-zinc-50 hover:text-black'
          }`}
      >
        <Icon size={20} />
        <span className="text-xs font-bold uppercase tracking-widest hidden md:block">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">

      {/* SIDEBAR (Solo Módulos Generales) */}
      <aside className="w-20 md:w-64 bg-white border-r border-zinc-200 fixed h-full z-40 flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center justify-center md:justify-start md:px-8 border-b border-zinc-100">
            <h2 className="text-2xl font-black italic tracking-tighter">NX<span className="text-green-500 md:inline hidden">.</span></h2>
          </div>

          <nav className="p-4 space-y-2 mt-4">
            <NavButton id="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavButton id="docentes" icon={Users} label="Docentes" />
            <NavButton id="ajustes" icon={Settings} label="Ajustes" />
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-100">
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Salir</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 ml-20 md:ml-64 flex flex-col min-h-screen">
        {/* Aquí va el NAVBAR SUPERIOR que controla las SEDES */}
        <Navbar activeSede={activeSede} onSedeSelect={onSedeSelect} />

        <div className="p-6 md:p-10 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;