import React, { useState } from 'react';
import { MapPin, ChevronDown, Bell, Search } from 'lucide-react';

interface NavbarProps {
  activeSede: string;
  onSedeSelect: (sede: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSede, onSedeSelect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Estado simple para simular una notificación no leída
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleSearchClick = () => {
    // Aquí iría la lógica de abrir un modal de búsqueda global
    alert("🔍 Funcionalidad de Búsqueda Global en desarrollo.\nPermitirá buscar alumnos o pagos en todas las sedes.");
  };

  const handleNotificationsClick = () => {
    // Aquí se abriría el panel de notificaciones
    setHasNotifications(false); // Marcamos como leídas al hacer clic
    alert("🔔 Centro de Notificaciones.\nAquí aparecerán alertas de pagos atrasados o cortes de caja.");
  };

  const sedes = [
    { id: 'GENERAL', label: 'Vista Global' },
    { id: 'aguascalientes', label: 'Aguascalientes' },
    { id: 'cdmx', label: 'Ciudad de México' },
    { id: 'monterrey', label: 'Monterrey' },
    { id: 'guadalajara', label: 'Guadalajara' },
  ];

  return (
    <div className="h-20 bg-white border-b border-zinc-100 px-8 flex items-center justify-between sticky top-0 z-30">

      {/* SELECTOR DE SEDES (MENÚ DESPLEGABLE) */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 bg-zinc-50 hover:bg-zinc-100 px-4 py-2 rounded-xl transition-colors border border-zinc-200"
        >
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
            <MapPin size={16} />
          </div>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Sede Actual</p>
            <p className="text-sm font-bold text-black flex items-center gap-2">
              {sedes.find(s => s.id === activeSede)?.label}
              <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </p>
          </div>
        </button>

        {/* DROPDOWN (La lista que se despliega) */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-zinc-100 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-top-2 p-2">
            <p className="px-4 py-2 text-[9px] font-black uppercase text-zinc-400">Seleccionar Campus</p>
            {sedes.map((sede) => (
              <button
                key={sede.id}
                onClick={() => {
                  onSedeSelect(sede.id);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors ${activeSede === sede.id ? 'bg-black text-white' : 'hover:bg-zinc-50 text-zinc-600'
                  }`}
              >
                {sede.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lado Derecho (BOTONES ACTIVADOS) */}
      <div className="flex items-center gap-4">

        {/* Botón Búsqueda */}
        <button
          onClick={handleSearchClick}
          className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all active:scale-95"
          title="Buscar"
        >
          <Search size={20} />
        </button>

        {/* Botón Notificaciones */}
        <button
          onClick={handleNotificationsClick}
          className="p-3 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all active:scale-95 relative"
          title="Notificaciones"
        >
          <Bell size={20} />
          {/* Puntito rojo reactivo */}
          {hasNotifications && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        <div className="h-8 w-[1px] bg-zinc-200 mx-2"></div>

        {/* Perfil (Ya estaba bien) */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black">Admin User</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Dueña</p>
          </div>
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black">AD</div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;