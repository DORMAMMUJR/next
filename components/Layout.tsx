import React, { useState } from 'react';
import { Role, AdminSection } from '../types';
import Navbar from './Navbar';
import Footer from './Footer';

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
  const isOwner = activeRole === Role.OWNER;
  const isAdminOrStaff = isControl || isFinanzas || isDireccion || isProfesor || isOwner;

  const getAdminMenu = (): { id: AdminSection; label: string; icon: string }[] => {
    const menu: { id: AdminSection; label: string; icon: string }[] = [
      { id: 'dashboard', label: isOwner ? 'Detector de Riesgos' : 'Dashboard', icon: isOwner ? '🦅' : '📊' },
    ];

    if (isOwner) {
       menu.push(
        { id: 'auditoria', label: 'Auditoría Multisede', icon: '🕵️' },
        { id: 'becas', label: 'Aprobación de Becas', icon: '✅' },
        { id: 'facturacion', label: 'Flujo de Caja', icon: '💰' },
       );
    } else if (isControl || isDireccion) {
      menu.push(
        { id: 'alumnos', label: 'Alumnos', icon: '👥' },
        { id: 'documentacion', label: 'Trámites SEP', icon: '🏛️' },
        { id: 'facturacion', label: 'Facturación CFDI', icon: '🧾' },
        { id: 'mensajes', label: 'Comunicación', icon: '✉️' },
      );
    } else if (isProfesor) {
      menu.push(
        { id: 'materias', label: 'Mis Listas', icon: '📋' },
        { id: 'reportes', label: 'Reporte Académico', icon: '🎓' },
      );
    }
    return menu;
  };

  const adminMenu = getAdminMenu();

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-next-green selection:text-white overflow-x-hidden">
      <Navbar 
        mode="dashboard"
        onHome={onHome}
        isAdminOrStaff={isAdminOrStaff}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isOwner={isOwner}
        onSedes={onSedes}
        activeRole={activeRole}
        onRoleSelect={onRoleSelect}
        onLogout={onLogout}
      />

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
              fixed lg:sticky top-16 md:top-24 bottom-0 left-0 w-72 md:w-80 bg-white border-r border-zinc-200 
              z-[90] lg:z-50 overflow-y-auto transition-all duration-500 ease-in-out
              ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}>
              <div className="p-6 md:p-10 space-y-2">
                <div className={`mb-8 md:mb-10 px-6 py-6 rounded-[28px] md:rounded-[32px] border ${isOwner ? 'bg-black text-white border-black' : 'bg-zinc-50 border-zinc-200'}`}>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${isOwner ? 'text-zinc-500' : 'text-zinc-500'}`}>Panel de Acceso</p>
                  <p className={`text-sm font-black italic truncate tracking-tighter uppercase ${isOwner ? 'text-white' : 'text-next-green'}`}>{activeRole?.replace('_', ' ')}</p>
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
                        : 'text-zinc-700 hover:text-black hover:bg-zinc-100'
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

        <main className="flex-1 flex flex-col min-h-screen bg-white transition-all">
          <div className={`flex-grow ${activeRole || currentAdminSection === 'sedes' ? 'p-4 sm:p-8 md:p-16 max-w-[1600px] mx-auto w-full' : ''}`}>
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;