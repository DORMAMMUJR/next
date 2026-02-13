
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
    <button onClick={onHome} className="text-xl md:text-3xl font-black italic tracking-tighter hover:opacity-70 transition-all uppercase text-black">
      NEXT<span className="text-next-green">.</span>
    </button>
  );

  // --- LANDING MODE ---
  if (mode === 'landing') {
    const { activeSection, onNavigate, onOpenLogin } = props;
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex gap-8">
            <button onClick={() => onNavigate?.('HOME')} className={`text-[11px] font-black uppercase tracking-widest hover:text-next-green transition-colors ${activeSection === 'HOME' ? 'text-black' : 'text-zinc-600'}`}>Inicio</button>
            <button onClick={() => onNavigate?.('ALUMNOS')} className={`text-[11px] font-black uppercase tracking-widest hover:text-next-green transition-colors ${activeSection === 'ALUMNOS' ? 'text-black' : 'text-zinc-600'}`}>Alumnos</button>
            <button onClick={() => onNavigate?.('DOCENTES')} className={`text-[11px] font-black uppercase tracking-widest hover:text-next-green transition-colors ${activeSection === 'DOCENTES' ? 'text-black' : 'text-zinc-600'}`}>Docentes</button>
            <button onClick={() => onOpenLogin?.('ADMIN')} className="text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-black transition-colors">Admin</button>
          </div>
        </div>
      </nav>
    );
  }

  // --- DASHBOARD MODE ---
  const { isAdminOrStaff, onMobileMenuToggle, isOwner, onSedes, activeRole, onRoleSelect, onLogout } = props;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-zinc-200 z-[70]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-12 h-16 md:h-24 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          {isAdminOrStaff && (
            <button 
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 text-black"
              aria-label="Menú"
            >
              <div className="w-6 h-0.5 bg-current mb-1.5 rounded-full"></div>
              <div className="w-4 h-0.5 bg-current mb-1.5 rounded-full"></div>
              <div className="w-6 h-0.5 bg-current rounded-full"></div>
            </button>
          )}
          <Logo />
          <div className="hidden lg:block border-l border-zinc-200 pl-12">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">
              {isOwner ? 'VISTA DE AUDITORÍA' : 'Bachillerato Ejecutivo Digital'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-8">
          <div className="hidden md:flex items-center gap-8 mr-4">
            <button onClick={onSedes} className="text-[10px] font-black uppercase tracking-widest text-zinc-800 hover:text-next-green transition-all">Sedes</button>
            {!activeRole && onRoleSelect && (
              <>
                <button onClick={() => onRoleSelect(Role.ALUMNO)} className="text-[10px] font-black uppercase tracking-widest text-zinc-800 hover:text-next-green transition-all">Alumnos</button>
                <button onClick={() => onRoleSelect(Role.PROFESOR)} className="text-[10px] font-black uppercase tracking-widest text-zinc-800 hover:text-next-green transition-all">Docentes</button>
                <button onClick={() => onRoleSelect(Role.OWNER)} className="text-[10px] font-black uppercase tracking-widest text-zinc-800 hover:text-next-green transition-all">Dueña</button>
              </>
            )}
          </div>

          <button 
            onClick={activeRole ? onLogout : () => onRoleSelect?.(Role.DIRECCION)}
            className={`px-5 md:px-10 py-2.5 md:py-4 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
              activeRole ? 'bg-zinc-100 text-zinc-800 hover:text-red-600 hover:bg-red-50' : 'bg-black text-white shadow-xl hover:bg-next-green'
            }`}
          >
            {activeRole ? 'Salir' : 'DIRECCIÓN'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
