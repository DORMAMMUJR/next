import React, { useState } from 'react';
import { MapPin, ChevronDown, Bell, Search, X, User, AlertCircle, CheckCircle } from 'lucide-react';

interface NavbarProps {
  activeSede: string;
  onSedeSelect: (sede: string) => void;
  // Pasamos los datos para poder buscar en ellos
  searchData?: { alumnos: any[], docentes: any[] };
}

const Navbar: React.FC<NavbarProps> = ({ activeSede, onSedeSelect, searchData }) => {
  const [isSedeOpen, setIsSedeOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- LÓGICA DE BÚSQUEDA ---
  const results = searchQuery.length > 2 && searchData ? {
    alumnos: searchData.alumnos.filter(a => a.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase())),
    docentes: searchData.docentes.filter(d => d.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()))
  } : { alumnos: [], docentes: [] };

  const sedes = [
    { id: 'GENERAL', label: 'Vista Global' },
    { id: 'aguascalientes', label: 'Aguascalientes' },
    { id: 'cdmx', label: 'CDMX' },
    { id: 'monterrey', label: 'Monterrey' },
    { id: 'guadalajara', label: 'Guadalajara' },
  ];

  return (
    <>
      <div className="h-20 bg-white border-b border-zinc-200 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">

        {/* SELECTOR DE SEDE (Igual que antes pero con texto más oscuro) */}
        <div className="relative">
          <button
            onClick={() => setIsSedeOpen(!isSedeOpen)}
            className="flex items-center gap-3 bg-zinc-50 hover:bg-zinc-100 px-4 py-2 rounded-xl transition-colors border border-zinc-200"
          >
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
              <MapPin size={16} />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Sede Actual</p>
              <p className="text-sm font-black text-zinc-900 flex items-center gap-2">
                {sedes.find(s => s.id === activeSede)?.label || 'Seleccionar'}
                <ChevronDown size={14} />
              </p>
            </div>
          </button>
          {/* DROPDOWN DE SEDES */}
          {isSedeOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-zinc-100 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-top-2 p-2">
              <p className="px-4 py-2 text-[9px] font-black uppercase text-zinc-500">Seleccionar Campus</p>
              {sedes.map((sede) => (
                <button
                  key={sede.id}
                  onClick={() => {
                    onSedeSelect(sede.id);
                    setIsSedeOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-colors ${activeSede === sede.id ? 'bg-black text-white' : 'hover:bg-zinc-50 text-zinc-700'
                    }`}
                >
                  {sede.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- ÁREA DERECHA: BUSCADOR Y NOTIFICACIONES --- */}
        <div className="flex items-center gap-4">

          {/* 1. BOTÓN DE BÚSQUEDA */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-3 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-all"
          >
            <Search size={22} strokeWidth={2.5} />
          </button>

          {/* 2. CAMPANA DE NOTIFICACIONES */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-3 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-xl transition-all relative"
            >
              <Bell size={22} strokeWidth={2.5} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* DROPDOWN DE NOTIFICACIONES */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 z-50">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50">
                  <h4 className="font-black text-sm uppercase">Notificaciones</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="p-4 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer flex gap-3">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-bold text-zinc-800">Nuevo pago recibido</p>
                        <p className="text-xs text-zinc-500 mt-1">El alumno Juan Pérez subió un comprobante.</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2">Hace {i * 10 + 5} min</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-xs font-bold text-center text-zinc-500 hover:text-black hover:bg-zinc-50">
                  Marcar todas como leídas
                </button>
              </div>
            )}
          </div>

          <div className="h-8 w-[1px] bg-zinc-200 mx-2"></div>

          {/* PERFIL */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-black text-zinc-900">Admin User</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Propietaria</p>
            </div>
            <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-black/20">AD</div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE BÚSQUEDA GLOBAL (Overlay) --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 flex items-center gap-4 border-b border-zinc-100">
              <Search className="text-zinc-400" size={24} />
              <input
                autoFocus
                type="text"
                placeholder="Buscar alumno, matrícula o docente..."
                className="flex-1 text-xl font-bold outline-none text-zinc-900 placeholder:text-zinc-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={() => setIsSearchOpen(false)} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 text-zinc-500">
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto bg-zinc-50/50 p-4">
              {searchQuery.length > 2 ? (
                <div className="space-y-6">
                  {/* Resultados Alumnos */}
                  {results.alumnos.length > 0 && (
                    <div>
                      <h5 className="text-xs font-black uppercase text-zinc-400 mb-3 ml-2">Alumnos Encontrados</h5>
                      {results.alumnos.map(a => (
                        <div key={a.id} className="bg-white p-4 rounded-xl border border-zinc-200 mb-2 flex justify-between items-center hover:shadow-md transition-all cursor-pointer">
                          <div>
                            <p className="font-bold text-zinc-900">{a.nombre_completo}</p>
                            <p className="text-xs font-mono text-zinc-500">{a.matricula}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${a.financial_status === 'DEBT' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {a.financial_status === 'DEBT' ? 'Adeudo' : 'Al corriente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resultados Docentes */}
                  {results.docentes.length > 0 && (
                    <div>
                      <h5 className="text-xs font-black uppercase text-zinc-400 mb-3 ml-2 mt-4">Docentes Encontrados</h5>
                      {results.docentes.map(d => (
                        <div key={d.id} className="bg-white p-4 rounded-xl border border-zinc-200 mb-2 flex gap-3 items-center hover:shadow-md transition-all cursor-pointer">
                          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center"><User size={14} /></div>
                          <div>
                            <p className="font-bold text-zinc-900">{d.nombre_completo}</p>
                            <p className="text-xs text-zinc-500">{d.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {results.alumnos.length === 0 && results.docentes.length === 0 && (
                    <div className="text-center py-10 text-zinc-400 font-bold">No encontramos nada con "{searchQuery}"</div>
                  )}
                </div>
              ) : (
                <div className="text-center py-20">
                  <Search size={48} className="mx-auto text-zinc-200 mb-4" />
                  <p className="text-zinc-400 font-bold">Escribe al menos 3 letras para buscar...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;