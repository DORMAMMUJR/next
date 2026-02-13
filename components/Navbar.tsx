import React, { useState } from 'react';
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
  isOwner?: boolean; // Kept as prop name for compatibility, but represents Admin
  onSedes?: () => void;
  activeRole?: Role | null;
  onRoleSelect?: (role: Role) => void;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { mode, onHome } = props;
  const [landingMenuOpen, setLandingMenuOpen] = useState(false);

  const Logo = () => (
    <button onClick={onHome} className="text-xl md:text-3xl font-black italic tracking-tighter hover:opacity-70 transition-all uppercase text-black flex items-center gap-1 z-[110] relative">
      NEXT<span className="text-next-green text-4xl leading-none">.</span>
    </button>
  );

  // --- LANDING MODE ---
  if (mode === 'landing') {
    const { activeSection, onNavigate, onOpenLogin } = props;

    const handleMobileNav = (action: () => void) => {
      action();
      setLandingMenuOpen(false);
    };

    return (
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-[60] border-b border-zinc-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo />
          
          {/* Desktop Menu - STRICTLY HIDDEN ON MOBILE */}
          <div className="hidden md:flex gap-10">
            <button onClick={() => onNavigate?.('HOME')} className={`text-xs font-bold uppercase tracking-widest hover:text-next-green transition-colors relative group ${activeSection === 'HOME' ? 'text-black' : 'text-zinc-500'}`}>
              Inicio
              <span className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-next-green transform scale-x-0 group-hover:scale-x-100 transition-transform ${activeSection === 'HOME' ? 'scale-x-100' : ''}`}></span>
            </button>
            <button onClick={() => onNavigate?.('ALUMNOS')} className={`text-xs font-bold uppercase tracking-widest hover:text-next-green transition-colors relative group ${activeSection === 'ALUMNOS' ? 'text-black' : 'text-zinc-500'}`}>
              Alumnos
              <span className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-next-green transform scale-x-0 group-hover:scale-x-100 transition-transform ${activeSection === 'ALUMNOS' ? 'scale-x-100' : ''}`}></span>
            </button>
            <button onClick={() => onNavigate?.('DOCENTES')} className={`text-xs font-bold uppercase tracking-widest hover:text-next-green transition-colors relative group ${activeSection === 'DOCENTES' ? 'text-black' : 'text-zinc-500'}`}>
              Docentes
              <span className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-next-green transform scale-x-0 group-hover:scale-x-100 transition-transform ${activeSection === 'DOCENTES' ? 'scale-x-100' : ''}`}></span>
            </button>
            <button onClick={() => onOpenLogin?.('ADMIN')} className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">
              Admin
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden z-[110] p-2 relative group" 
            onClick={() => setLandingMenuOpen(!landingMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all duration-300 ${landingMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all duration-300 ${landingMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${landingMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>

          {/* Mobile Overlay Menu - Full Screen, Solid Background, High Z-Index */}
          {landingMenuOpen && (
            <div className="fixed inset-0 bg-white z-[100] flex flex-col justify-center px-8 space-y-8 md:hidden animate-in slide-in-from-right duration-300 h-screen w-screen overflow-hidden">
               {/* Background pattern for texture */}
               <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
               
               <div className="space-y-6 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 pb-2">Menú Principal</p>
                  <button onClick={() => handleMobileNav(() => onNavigate?.('HOME'))} className="block text-4xl font-black italic uppercase tracking-tighter text-black hover:text-next-green transition-colors text-left w-full">Inicio</button>
                  <button onClick={() => handleMobileNav(() => onNavigate?.('ALUMNOS'))} className="block text-4xl font-black italic uppercase tracking-tighter text-black hover:text-next-green transition-colors text-left w-full">Alumnos</button>
                  <button onClick={() => handleMobileNav(() => onNavigate?.('DOCENTES'))} className="block text-4xl font-black italic uppercase tracking-tighter text-black hover:text-next-green transition-colors text-left w-full">Docentes</button>
               </div>
               
               <div className="pt-8 relative z-10">
                  <button 
                    onClick={() => handleMobileNav(() => onOpenLogin?.('ADMIN'))} 
                    className="w-full bg-zinc-100 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    Acceso Administrativo
                  </button>
               </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // --- DASHBOARD MODE ---
  const { isAdminOrStaff, onMobileMenuToggle, isOwner, onSedes, activeRole, onRoleSelect, onLogout } = props;

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
          <div className="hidden md:flex items-center gap-6 mr-4">
            <button onClick={onSedes} className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-black transition-all">Sedes</button>
            {!activeRole && onRoleSelect && (
              <div className="flex bg-zinc-100 p-1 rounded-full">
                <button onClick={() => onRoleSelect(Role.ALUMNO)} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white hover:text-black hover:shadow-sm transition-all">Alumnos</button>
                <button onClick={() => onRoleSelect(Role.PROFESOR)} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white hover:text-black hover:shadow-sm transition-all">Docentes</button>
                <button onClick={() => onRoleSelect(Role.ADMIN)} className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-white hover:text-black hover:shadow-sm transition-all">Admin</button>
              </div>
            )}
          </div>

          <button 
            onClick={activeRole ? onLogout : () => onRoleSelect?.(Role.DIRECCION)}
            className={`px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 ${
              activeRole ? 'bg-zinc-100 text-zinc-800 hover:text-red-600 hover:bg-red-50' : 'bg-black text-white shadow-xl hover:shadow-next-green/20 hover:bg-zinc-900'
            }`}
          >
            {activeRole ? 'Salir' : 'Dirección'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;