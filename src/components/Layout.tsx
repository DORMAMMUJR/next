import React from 'react';
import { Role, AdminSection } from '../types';
import {
  LayoutDashboard,
  Users,
  MapPin,
  LogOut,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: Role | null;
  onRoleSelect: (role: Role) => void;
  onHome: () => void;
  onLogout: () => void;
  onSedes: () => void;
  activeTab?: AdminSection;
  onTabChange?: (tab: AdminSection) => void;
}

// Utility for merging classes
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Layout: React.FC<LayoutProps> = ({
  children, activeRole, onLogout, activeTab, onTabChange
}) => {
  const isOwner = activeRole === Role.OWNER;

  const NavItem = ({
    icon: Icon,
    label,
    active,
    onClick
  }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-300 relative overflow-hidden",
        active
          ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/10"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", active ? "text-green-400" : "text-zinc-400 group-hover:text-zinc-900")} />
      <span className="font-bold text-sm tracking-wide">{label}</span>
      {active && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-l-full" />
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-zinc-200 fixed h-full flex flex-col justify-between p-6 z-20 hidden lg:flex shadow-sm">
        <div className="space-y-10">
          {/* Logo */}
          <div className="pl-2">
            <h1 className="text-4xl font-black italic tracking-tighter text-zinc-900">
              NEXT<span className="text-green-500">.</span>
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", isOwner ? "bg-black" : "bg-green-500")} />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {isOwner ? 'Administrator' : 'Faculty Access'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Menu Principal</h3>

            <NavItem
              icon={LayoutDashboard}
              label="Dashboard"
              active={activeTab === 'dashboard'}
              onClick={() => onTabChange?.('dashboard')}
            />

            {isOwner && (
              <>
                <NavItem
                  icon={MapPin}
                  label="Sedes"
                  active={activeTab === 'sedes'}
                  onClick={() => onTabChange?.('sedes')}
                />
                <NavItem
                  icon={BookOpen}
                  label="Materias"
                  active={activeTab === 'materias'}
                  onClick={() => onTabChange?.('materias')}
                />
                <NavItem
                  icon={ShieldCheck}
                  label="Auditoría"
                  active={activeTab === 'auditoria'}
                  onClick={() => onTabChange?.('auditoria')}
                />
              </>
            )}

            {!isOwner && (
              <NavItem
                icon={Users}
                label="Mis Alumnos"
                active={true}
              />
            )}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="space-y-6">
          <div className="bg-zinc-50 p-4 rounded-2xl flex items-center gap-3 border border-zinc-100">
            <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-500">
              {isOwner ? 'AD' : 'PR'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-zinc-900">{isOwner ? 'Admin User' : 'Docente'}</p>
              <p className="text-[10px] text-zinc-400 font-medium truncate">Sesión Activa</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-4 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-80 p-6 md:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;