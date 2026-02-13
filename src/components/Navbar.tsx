import React from 'react';
import { Role } from '../types';

interface NavbarProps {
  mode: 'landing' | 'dashboard';

  // Shared
  onHome: () => void;

  // Landing Specific
  activeSection?: string;
  onNavigate?: (section: any) => void;
  onOpenLogin?: (mode: any) => void;

  // Dashboard Specific
  isAdminOrStaff?: boolean;
  onMobileMenuToggle?: () => void;
  isOwner?: boolean;
  onSedes?: () => void;
  activeRole?: Role | null;
  onRoleSelect?: (role: Role) => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { mode, onHome } = props;


  const Logo = () => (
    <button onClick={onHome} className="text-xl md:text-3xl font-black italic tracking-tighter hover:opacity-70 transition-all uppercase text-black flex items-center gap-1 z-[110] relative">
      NEXT<span className="text-next-green text-4xl leading-none">.</span>
    </button>
  );

  // --- LANDING MODE ---
  if (mode === 'landing') {
    const { onNavigate } = props;



    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-[60] border-b border-zinc-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-10">
            <button onClick={() => onNavigate?.('HOME')} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">
              Inicio
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // --- DASHBOARD MODE ---
  const { isAdminOrStaff, onMobileMenuToggle, isOwner, activeRole, onLogout } = props;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-zinc-200 z-[70]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 h-16 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          {isAdminOrStaff && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 text-black hover:bg-zinc-100 rounded-lg transition-colors"
              aria-label="Menú"
            >
              <div className="w-6 h-0.5 bg-current mb-1.5 rounded-full"></div>
              <div className="w-4 h-0.5 bg-current mb-1.5 rounded-full"></div>
              <div className="w-6 h-0.5 bg-current rounded-full"></div>
            </button>
          )}
          <Logo />
          <div className="hidden lg:block border-l-2 border-zinc-100 pl-8 ml-4">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
              {isOwner ? 'Panel Administrativo' : 'Bachillerato Ejecutivo Digital'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-8">
          <button
            onClick={activeRole ? onLogout : undefined}
            className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 ${activeRole ? 'bg-zinc-100 text-zinc-800 hover:text-red-600 hover:bg-red-50' : 'bg-black text-white shadow-xl hover:shadow-next-green/20 hover:bg-zinc-900'
              }`}
          >
            {activeRole ? 'Cerrar Sesión' : 'Salir'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;