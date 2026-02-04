
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
  const isControl = activeRole === Role.CONTROL_ESCOLAR;
  const isFinanzas = activeRole === Role.FINANZAS;
  const isDireccion = activeRole === Role.DIRECCION;
  const isProfesor = activeRole === Role.PROFESOR;
  const isAdminOrStaff = isControl || isFinanzas || isDireccion || isProfesor;

  const [globalSearch, setGlobalSearch] = useState('');

  const getAdminMenu = (): { id: AdminSection; label: string; icon: string }[] => {
    const menu: { id: AdminSection; label: string; icon: string }[] = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    ];

    if (isControl) {
      menu.push(
        { id: 'alumnos', label: 'Alumnos', icon: '👥' },
        { id: 'expedientes', label: 'Expedientes', icon: '📂' },
        { id: 'pagos', label: 'Pagos y Colegiaturas', icon: '💳' },
        { id: 'materias', label: 'Materias', icon: '📖' },
        { id: 'profesores', label: 'Profesores', icon: '👨‍🏫' },
        { id: 'sedes', label: 'Sedes', icon: '📍' },
        { id: 'examenes', label: 'Exámenes', icon: '📝' },
        { id: 'calificaciones', label: 'Calificaciones', icon: '🎯' },
        { id: 'documentacion', label: 'Documentación Oficial', icon: '📜' },
        { id: 'reportes', label: 'Reportes', icon: '📈' },
        { id: 'alertas', label: 'Alertas', icon: '🔔' },
        { id: 'auditoria', label: 'Auditorías', icon: '🕵️' },
      );
      return menu;
    }

    if (isProfesor) {
      menu.push(
        { id: 'mis_materias', label: 'Mis Materias', icon: '📖' },
        { id: 'grupos', label: 'Grupos', icon: '👥' },
        { id: 'contenidos', label: 'Contenidos', icon: '📁' },
        { id: 'actividades', label: 'Actividades', icon: '✍️' },
        { id: 'examenes', label: 'Exámenes', icon: '📝' },
        { id: 'calificaciones', label: 'Calificaciones', icon: '🎯' },
        { id: 'mensajes', label: 'Mensajes', icon: '✉️' },
        { id: 'agenda', label: 'Agenda', icon: '📅' },
        { id: 'reportes', label: 'Reportes', icon: '📈' },
        { id: 'perfil', label: 'Perfil', icon: '👤' },
      );
      return menu;
    }

    if (isDireccion || isFinanzas) {
      menu.push(
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'pagos', label: 'Pagos en Línea', icon: '💳' },
        { id: 'cobranza', label: 'Cobranza Auto.', icon: '🤖' },
        { id: 'facturacion', label: 'Facturación', icon: '🧾' },
        { id: 'presupuestos', label: 'Presupuestos', icon: '📉' },
        { id: 'sedes', label: 'Sedes', icon: '📍' },
        { id: 'reportes', label: 'Reportes', icon: '📈' },
        { id: 'auditoria', label: 'Auditorías', icon: '🕵️' },
        { id: 'configuracion_fin', label: 'Config. Fin.', icon: '⚙️' },
      );
      return menu;
    }

    return menu;
  };

  const adminMenu = getAdminMenu();

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-next-green selection:text-white">
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-zinc-100 z-[60]">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={onHome} className="text-2xl font-black italic tracking-tighter hover:opacity-70 transition-opacity">
              NEXT<span className="text-next-green">.</span>
            </button>
            <div className="hidden lg:block border-l border-zinc-100 pl-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">Bachillerato Ejecutivo</p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            {/* Buscador global solo para staff con sesión activa */}
            {isAdminOrStaff && (
              <div className="hidden md:flex relative w-48 lg:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  className="w-full bg-zinc-50 border-none rounded-xl px-10 py-2.5 text-[10px] font-bold focus:ring-1 focus:ring-next-green transition-all"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                />
                <span className="absolute left-3.5 top-2.5 text-zinc-300 text-xs">🔍</span>
              </div>
            )}

            {/* Enlaces Rápidos Nav Derecha */}
            <div className="flex items-center gap-4 md:gap-6">
              <button 
                onClick={onSedes}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-next-green transition-all"
              >
                <span className="text-sm">📍</span> <span className="hidden sm:inline">Sedes</span>
              </button>

              {/* Botones de Apartados en la parte superior cuando no hay sesión activa */}
              {!activeRole && (
                <div className="hidden md:flex items-center gap-6 border-l border-zinc-100 pl-6">
                  <button 
                    onClick={() => onRoleSelect(Role.ALUMNO)} 
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-next-green transition-all"
                  >
                    Alumnos
                  </button>
                  <button 
                    onClick={() => onRoleSelect(Role.PROFESOR)} 
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-next-green transition-all"
                  >
                    Profesores
                  </button>
                  <button 
                    onClick={() => onRoleSelect(Role.CONTROL_ESCOLAR)} 
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-next-green transition-all"
                  >
                    Control Escolar
                  </button>
                </div>
              )}
              
              <button 
                onClick={activeRole ? onLogout : () => onRoleSelect(Role.ALUMNO)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeRole ? 'bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-500' : 'bg-next-green text-white shadow-lg shadow-next-green/20 hover:scale-105'
                }`}
              >
                {activeRole ? 'Salir' : 'DIRECCIÓN'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-20">
        {isAdminOrStaff && onAdminSectionChange && (
          <aside className="w-72 bg-white border-r border-zinc-100 fixed left-0 top-20 bottom-0 overflow-y-auto hidden lg:block z-50">
            <div className="p-8 space-y-1">
              <div className="mb-8 px-4 py-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Sesión Administrativa</p>
                <p className="text-xs font-black text-next-green italic truncate">{activeRole?.toUpperCase()}</p>
              </div>
              {adminMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onAdminSectionChange(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    currentAdminSection === item.id 
                      ? 'bg-next-green text-white shadow-lg shadow-next-green/20' 
                      : 'text-zinc-400 hover:text-next-black hover:bg-zinc-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </aside>
        )}

        <main className={`flex-1 ${isAdminOrStaff ? 'lg:ml-72' : ''} min-h-screen bg-white`}>
          <div className={`${activeRole || currentAdminSection === 'sedes' ? 'p-8 lg:p-12 max-w-[1400px] mx-auto' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
