import React, { useState } from 'react';
import { Role } from '../types';
import Footer from './Footer'; // <--- Importamos el nuevo Footer

interface LandingProps {
  onLogin: (identifier: string, credential: string, role: Role) => Promise<{ success: boolean; error?: string }>;
}

const LandingPage: React.FC<LandingProps> = ({ onLogin }) => {
  const [viewState, setViewState] = useState<'menu' | 'login'>('menu');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PROFESOR);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelection = (role: Role) => {
    setSelectedRole(role);
    setViewState('login');
    setError(null);
    setIdentifier('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await onLogin(identifier, password, selectedRole);
    if (!result.success) setError(result.error || 'Credenciales incorrectas');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between relative overflow-hidden">

      {/* Fondo Decorativo Sutil */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-white border-b border-zinc-200 -z-10" />

      {/* CONTENIDO CENTRAL */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 w-full max-w-6xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">

          {/* Lado Izquierdo: Branding */}
          <div className="text-left space-y-6">
            <div className="inline-block bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
              Versión 2.0
            </div>
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-black leading-none">
              NEXT<span className="text-next-green">.</span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-zinc-500 max-w-md leading-relaxed">
              La evolución del control escolar. Gestión administrativa y docente centralizada en una sola plataforma segura.
            </p>
          </div>

          {/* Lado Derecho: Interacción */}
          <div className="w-full max-w-md ml-auto">
            {viewState === 'menu' ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                <button
                  onClick={() => handleSelection(Role.PROFESOR)}
                  className="group w-full bg-white border border-zinc-200 p-8 rounded-3xl flex items-center justify-between transition-all hover:shadow-2xl hover:scale-[1.02] hover:border-black"
                >
                  <div className="text-left">
                    <span className="font-black text-sm uppercase tracking-widest text-zinc-400 group-hover:text-black block mb-1">Acceso</span>
                    <span className="text-3xl font-black text-black">Docentes</span>
                  </div>
                  <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">→</div>
                </button>

                <button
                  onClick={() => handleSelection(Role.OWNER)}
                  className="group w-full bg-black text-white border border-black p-8 rounded-3xl flex items-center justify-between transition-all hover:shadow-2xl hover:scale-[1.02]"
                >
                  <div className="text-left">
                    <span className="font-black text-sm uppercase tracking-widest text-zinc-500 block mb-1">Acceso</span>
                    <span className="text-3xl font-black text-white">Administración</span>
                  </div>
                  <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">→</div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300 space-y-6 relative">
                <button
                  type="button"
                  onClick={() => setViewState('menu')}
                  className="absolute top-6 right-6 text-zinc-400 hover:text-black text-xs font-bold uppercase tracking-widest"
                >
                  ✕ Volver
                </button>

                <h2 className="text-2xl font-black italic uppercase mb-6">
                  {selectedRole === Role.OWNER ? 'Login Administrativo' : 'Login Docente'}
                </h2>

                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 group-focus-within:text-black transition-colors">Identificador</label>
                    <input
                      autoFocus
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl p-4 font-bold text-lg outline-none transition-all"
                      placeholder={selectedRole === Role.OWNER ? "1234" : "DOC-..."}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2 group-focus-within:text-black transition-colors">Clave de Acceso</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-50 border-2 border-transparent focus:bg-white focus:border-black rounded-xl p-4 font-bold text-lg outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl text-center animate-pulse border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full bg-black text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/20"
                >
                  {loading ? 'Validando...' : 'Iniciar Sesión'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER RECUPERADO Y MEJORADO */}
      <Footer />
    </div>
  );
};

export default LandingPage;