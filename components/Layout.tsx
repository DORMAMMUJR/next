
import React, { useState } from 'react';
import { Role, AdminSection } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: Role | null;
  onRoleSelect: (role: Role) => void;
  onHome: () => void;
  onLogout: () => void;
  onSedes: () => void;
  currentAdminSection?: AdminSection;
  onAdminSectionChange?: (section: AdminSection) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeRole, 
  onRoleSelect, 
  onHome, 
  onLogout,
  onSedes,
  currentAdminSection,
  onAdminSectionChange
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isControl = activeRole === Role.CONTROL_ESCOLAR;
  const isFinanzas = activeRole === Role.FINANZAS;
  const isDireccion = activeRole === Role.DIRECCION;
  const isProfesor = activeRole === Role.PROFESOR;
  const isAdminOrStaff = isControl || isFinanzas || isDireccion || isProfesor;

  const getAdminMenu = (): { id: AdminSection; label: string; icon: string }[] => {
    const menu: { id: AdminSection; label: string; icon: string }[] = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    ];

    if (isControl || isDireccion) {
      menu.push(
        { id: 'alumnos', label: 'Alumnos', icon: '👥' },
        { id: 'documentacion', label: 'Trámites SEP', icon: '🏛️' },
        { id: 'facturacion', label: 'Facturación CFDI', icon: '🧾' },
        { id: 'mensajes', label: 'Comunicación', icon: '✉️' },
        { id: 'auditoria', label: 'Auditoría', icon: '🕵️' },
      );
    } else if (isProfesor) {
      menu.push(
        { id: 'materias', label: 'Mis Materias', icon: '📖' },
        { id: 'reportes', label: 'Grupos', icon: '👥' },
        { id: 'dashboard', label: 'Calificaciones', icon: '🎯' },
      );
    }
    return menu;
  };

  const adminMenu = getAdminMenu();

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-next-green selection:text-white overflow-x-hidden">
      {/* Navbar Superior */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-zinc-100 z-[70]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 h-16 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-12">
            {isAdminOrStaff && (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-black"
                aria-label="Menú"
              >
                <div className="w-6 h-0.5 bg-current mb-1.5 rounded-full"></div>
                <div className="w-4 h-0.5 bg-current mb-1.5 rounded-full"></div>
                <div className="w-6 h-0.5 bg-current rounded-full"></div>
              </button>
            )}
            <button onClick={onHome} className="text-xl md:text-3xl font-black italic tracking-tighter hover:opacity-70 transition-all uppercase">
              NEXT<span className="text-next-green">.</span>
            </button>
            <div className="hidden lg:block border-l border-zinc-100 pl-12">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Bachillerato Ejecutivo Digital</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden md:flex items-center gap-8 mr-4">
              <button onClick={onSedes} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-next-green transition-all">Sedes</button>
              {!activeRole && (
                <>
                  <button onClick={() => onRoleSelect(Role.ALUMNO)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-next-green transition-all">Alumnos</button>
                  <button onClick={() => onRoleSelect(Role.PROFESOR)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-next-green transition-all">Profesores</button>
                  <button onClick={() => onRoleSelect(Role.CONTROL_ESCOLAR)} className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-next-green transition-all">Control Escolar</button>
                </>
              )}
            </div>

            <button 
              onClick={activeRole ? onLogout : () => onRoleSelect(Role.DIRECCION)}
              className={`px-5 md:px-10 py-2.5 md:py-4 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                activeRole ? 'bg-zinc-50 text-zinc-500 hover:text-red-500' : 'bg-black text-white shadow-xl hover:bg-next-green'
              }`}
            >
              {activeRole ? 'Salir' : 'DIRECCIÓN'}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16 md:pt-24">
        {isAdminOrStaff && (
          <>
            {isMobileMenuOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-[80] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
            )}
            
            <aside className={`
              fixed lg:sticky top-16 md:top-24 bottom-0 left-0 w-72 md:w-80 bg-white border-r border-zinc-100 
              z-[90] lg:z-50 overflow-y-auto transition-all duration-500 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="p-6 md:p-10 space-y-2">
                <div className="mb-8 md:mb-10 px-6 py-6 bg-zinc-50 rounded-[28px] md:rounded-[32px] border border-zinc-100">
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">Panel Administrativo</p>
                  <p className="text-sm font-black text-next-green italic truncate tracking-tighter uppercase">{activeRole?.replace('_', ' ')}</p>
                </div>
                {adminMenu.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onAdminSectionChange?.(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 md:gap-5 px-5 md:px-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] transition-all group ${
                      currentAdminSection === item.id || (currentAdminSection === 'expedientes' && item.id === 'alumnos')
                        ? 'bg-next-green text-white shadow-xl shadow-next-green/20' 
                        : 'text-zinc-500 hover:text-black hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-xl group-hover:scale-125 transition-transform">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </aside>
          </>
        )}

        <main className={`flex-1 min-h-screen bg-white transition-all`}>
          <div className={`${activeRole || currentAdminSection === 'sedes' ? 'p-4 sm:p-8 md:p-16 max-w-[1600px] mx-auto' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
